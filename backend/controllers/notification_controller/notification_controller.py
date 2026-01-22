from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from repositories.notification_repository.notification_repository import NotificationRepository
from repositories.user_repository.user_repository import UserRepository
from repositories.profile_repository.profile_repository import ProfileRepository
from shared.token import get_current_user
from models.user.user import User
import base64

router = APIRouter()


@router.get("/notifications")
async def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all notifications for the current user."""
    try:
        notifications = NotificationRepository.get_by_user_id(db, current_user.id)
        
        # Enrich with sender information
        result = []
        for notification in notifications:
            notif_dict = notification.to_dict()
            
            # If notification has a from_user_id, add their info
            if notification.from_user_id:
                from_user = UserRepository.get_by_id(db, notification.from_user_id)
                from_profile = ProfileRepository.get_by_user_id(db, notification.from_user_id)
                
                if from_user:
                    # Convert profile picture to base64 if exists
                    profile_picture_base64 = None
                    if from_profile and from_profile.profile_picture_data:
                        try:
                            encoded = base64.b64encode(from_profile.profile_picture_data).decode('utf-8')
                            content_type = from_profile.profile_picture_content_type or "image/jpeg"
                            profile_picture_base64 = f"data:{content_type};base64,{encoded}"
                        except Exception as e:
                            print(f"Error encoding profile picture: {e}")
                    
                    notif_dict["from_user"] = {
                        "id": from_user.id,
                        "name": from_user.name,
                        "age": from_user.age,
                        "profile_picture": profile_picture_base64
                    }
            
            result.append(notif_dict)
        
        # Also return unread count
        unread_count = NotificationRepository.count_unread(db, current_user.id)
        
        return JSONResponse(
            content={
                "notifications": result,
                "unread_count": unread_count
            },
            status_code=200
        )
    
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/notifications/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a notification as read."""
    try:
        notification = NotificationRepository.get_by_id(db, notification_id)
        
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        # Verify the notification belongs to the current user
        if notification.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only mark your own notifications as read")
        
        # Mark as read
        updated_notification = NotificationRepository.mark_as_read(db, notification)
        
        return JSONResponse(
            content={
                "message": "Notification marked as read",
                "notification": updated_notification.to_dict()
            },
            status_code=200
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error marking notification as read: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/notifications/read-all")
async def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all notifications as read for the current user."""
    try:
        count = NotificationRepository.mark_all_as_read(db, current_user.id)
        
        return JSONResponse(
            content={
                "message": f"Marked {count} notifications as read"
            },
            status_code=200
        )
    
    except Exception as e:
        print(f"Error marking all notifications as read: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/notifications/{notification_id}")
async def delete_notification(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a notification."""
    try:
        notification = NotificationRepository.get_by_id(db, notification_id)
        
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        # Verify the notification belongs to the current user
        if notification.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only delete your own notifications")
        
        # Delete the notification
        NotificationRepository.delete(db, notification)
        
        return JSONResponse(
            content={"message": "Notification deleted successfully"},
            status_code=200
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting notification: {e}")
        raise HTTPException(status_code=500, detail=str(e))
