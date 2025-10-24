from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user.user import User
from shared.token import get_current_admin_user
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class UserResponse(BaseModel):
    id: str
    email: str
    is_admin: bool
    verification_status: str
    is_deleted: bool
    is_archived: bool
    created_at: str

class AdminPromoteRequest(BaseModel):
    user_id: str

class UsersListResponse(BaseModel):
    users: List[UserResponse]
    total_count: int

@router.get("/users", response_model=UsersListResponse)
async def get_all_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Admin endpoint to get all users with pagination
    """
    # Get total count
    total_count = db.query(User).filter(User.is_deleted == False).count()
    
    # Get users with pagination
    users = db.query(User).filter(User.is_deleted == False).offset(skip).limit(limit).all()
    
    user_responses = [
        UserResponse(
            id=user.id,
            email=user.email,
            is_admin=user.is_admin,
            verification_status=user.verification_status,
            is_deleted=user.is_deleted,
            is_archived=user.is_archived,
            created_at=user.created_at.isoformat()
        )
        for user in users
    ]
    
    return UsersListResponse(
        users=user_responses,
        total_count=total_count
    )

@router.post("/promote-admin")
async def promote_user_to_admin(
    request: AdminPromoteRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Admin endpoint to promote a regular user to admin
    """
    user = db.query(User).filter(User.id == request.user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_admin:
        raise HTTPException(status_code=400, detail="User is already an admin")
    
    user.promote_to_admin()
    db.commit()
    
    return {
        "success": True,
        "message": f"User {user.email} has been promoted to admin",
        "user_id": user.id
    }

@router.post("/demote-admin")
async def demote_admin_to_user(
    request: AdminPromoteRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Admin endpoint to demote an admin user to regular user
    """
    user = db.query(User).filter(User.id == request.user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.is_admin:
        raise HTTPException(status_code=400, detail="User is not an admin")
    
    # Prevent self-demotion
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot demote yourself")
    
    user.demote_from_admin()
    db.commit()
    
    return {
        "success": True,
        "message": f"Admin {user.email} has been demoted to regular user",
        "user_id": user.id
    }

@router.get("/stats")
async def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Admin endpoint to get system statistics
    """
    total_users = db.query(User).filter(User.is_deleted == False).count()
    total_admins = db.query(User).filter(User.is_admin == True, User.is_deleted == False).count()
    pending_verifications = db.query(User).filter(
        User.verification_status.in_(["pending", "in_progress"]),
        User.is_deleted == False
    ).count()
    verified_users = db.query(User).filter(
        User.verification_status == "verified",
        User.is_deleted == False
    ).count()
    rejected_verifications = db.query(User).filter(
        User.verification_status == "rejected",
        User.is_deleted == False
    ).count()
    
    return {
        "total_users": total_users,
        "total_admins": total_admins,
        "pending_verifications": pending_verifications,
        "verified_users": verified_users,
        "rejected_verifications": rejected_verifications,
        "verification_rate": round((verified_users / total_users * 100), 2) if total_users > 0 else 0
    }