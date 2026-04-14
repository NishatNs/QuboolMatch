from collections import defaultdict
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db, SessionLocal
from models.user.user import User
from repositories.interest_repository.interest_repository import InterestRepository
from repositories.message_repository.message_repository import MessageRepository
from repositories.notification_repository.notification_repository import NotificationRepository
from repositories.user_repository.user_repository import UserRepository
from shared.token import Token, get_current_user

router = APIRouter()


class SendMessageRequest(BaseModel):
    to_user_id: str
    content: str


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = defaultdict(list)

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id].append(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket):
        if user_id in self.active_connections and websocket in self.active_connections[user_id]:
            self.active_connections[user_id].remove(websocket)
        if user_id in self.active_connections and not self.active_connections[user_id]:
            del self.active_connections[user_id]

    async def send_to_user(self, user_id: str, payload: dict):
        dead_connections: List[WebSocket] = []
        for connection in self.active_connections.get(user_id, []):
            try:
                await connection.send_json(payload)
            except Exception:
                dead_connections.append(connection)

        for dead in dead_connections:
            self.disconnect(user_id, dead)


manager = ConnectionManager()


def _validate_chat_allowed(db: Session, current_user_id: str, other_user_id: str):
    if current_user_id == other_user_id:
        raise HTTPException(status_code=400, detail="You cannot chat with yourself")

    other_user = UserRepository.get_by_id(db, other_user_id)
    if not other_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not InterestRepository.check_accepted_interest_between(db, current_user_id, other_user_id):
        raise HTTPException(status_code=403, detail="Chat is allowed only after an accepted interest request")


@router.post("/messages/send")
async def send_message(
    params: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    content = (params.content or "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    if len(content) > 1000:
        raise HTTPException(status_code=400, detail="Message is too long (max 1000 characters)")

    _validate_chat_allowed(db, current_user.id, params.to_user_id)

    message = MessageRepository.create(
        db,
        from_user_id=current_user.id,
        to_user_id=params.to_user_id,
        content=content,
    )

    NotificationRepository.create(
        db,
        user_id=params.to_user_id,
        notification_type="new_message",
        message=f"{current_user.name} sent you a message",
        from_user_id=current_user.id,
        related_id=message.id,
    )

    payload = {
        "type": "new_message",
        "message": message.to_dict(),
        "from_user": {
            "id": current_user.id,
            "name": current_user.name,
        },
    }

    await manager.send_to_user(params.to_user_id, payload)

    return JSONResponse(content={"message": message.to_dict()}, status_code=201)


@router.get("/messages/conversations")
async def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversations = MessageRepository.get_conversations(db, current_user.id)
    return JSONResponse(
        content={
            "conversations": conversations,
            "total_unread": MessageRepository.count_unread(db, current_user.id),
        },
        status_code=200,
    )


@router.get("/messages/thread/{other_user_id}")
async def get_thread(
    other_user_id: str,
    limit: int = Query(default=100, ge=1, le=300),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _validate_chat_allowed(db, current_user.id, other_user_id)

    messages = MessageRepository.get_thread(db, current_user.id, other_user_id, limit=limit)
    return JSONResponse(content={"messages": [m.to_dict() for m in messages]}, status_code=200)


@router.put("/messages/thread/{other_user_id}/read")
async def mark_thread_as_read(
    other_user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _validate_chat_allowed(db, current_user.id, other_user_id)

    updated_count = MessageRepository.mark_thread_as_read(db, current_user.id, other_user_id)
    return JSONResponse(content={"updated_count": updated_count}, status_code=200)


@router.get("/messages/unread-count")
async def unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return JSONResponse(
        content={"unread_count": MessageRepository.count_unread(db, current_user.id)},
        status_code=200,
    )


def _get_user_from_ws_token(token: str):
    payload = Token.verify_token(token)
    if not payload or not payload.get("user_id"):
        return None

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == payload.get("user_id")).first()
        return user
    finally:
        db.close()


@router.websocket("/ws/messages")
async def messages_websocket(websocket: WebSocket, token: str = Query(default="")):
    user = _get_user_from_ws_token(token)
    if not user:
        await websocket.close(code=1008)
        return

    await manager.connect(user.id, websocket)

    try:
        await manager.send_to_user(
            user.id,
            {
                "type": "presence",
                "message": "Connected to chat server",
                "user_id": user.id,
            },
        )
        while True:
            # Keep connection alive. Client can send ping payloads if desired.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user.id, websocket)
    except Exception:
        manager.disconnect(user.id, websocket)
        await websocket.close()
