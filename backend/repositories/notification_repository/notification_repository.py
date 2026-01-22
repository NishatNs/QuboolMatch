from sqlalchemy.orm import Session
from models.notification.notification import Notification
from typing import List, Optional


class NotificationRepository:
    """Repository class for handling CRUD operations on the Notification model."""

    @staticmethod
    def create(
        db: Session,
        user_id: str,
        notification_type: str,
        message: str,
        from_user_id: Optional[str] = None,
        related_id: Optional[str] = None
    ) -> Notification:
        """
        Create a new notification.
        
        Args:
            db: Database session
            user_id: ID of the user receiving the notification
            notification_type: Type of notification (interest_received, interest_accepted, etc.)
            message: Notification message
            from_user_id: Optional ID of the user who triggered the notification
            related_id: Optional ID of related entity (e.g., interest_id)
            
        Returns:
            Notification: Created notification object
        """
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            message=message,
            from_user_id=from_user_id,
            related_id=related_id,
            is_read=False
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def get_by_id(db: Session, notification_id: str) -> Optional[Notification]:
        """Get notification by ID."""
        return db.query(Notification).filter(Notification.id == notification_id).first()

    @staticmethod
    def get_by_user_id(db: Session, user_id: str, unread_only: bool = False) -> List[Notification]:
        """
        Get all notifications for a user.
        
        Args:
            db: Database session
            user_id: User ID
            unread_only: If True, only return unread notifications
            
        Returns:
            List[Notification]: List of notifications
        """
        query = db.query(Notification).filter(Notification.user_id == user_id)
        if unread_only:
            query = query.filter(Notification.is_read == False)
        return query.order_by(Notification.created_at.desc()).all()

    @staticmethod
    def mark_as_read(db: Session, notification: Notification) -> Notification:
        """
        Mark a notification as read.
        
        Args:
            db: Database session
            notification: Notification object to mark as read
            
        Returns:
            Notification: Updated notification object
        """
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def mark_all_as_read(db: Session, user_id: str) -> int:
        """
        Mark all notifications as read for a user.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            int: Number of notifications updated
        """
        count = db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).update({"is_read": True})
        db.commit()
        return count

    @staticmethod
    def delete(db: Session, notification: Notification) -> None:
        """
        Delete a notification.
        
        Args:
            db: Database session
            notification: Notification object to delete
        """
        db.delete(notification)
        db.commit()

    @staticmethod
    def count_unread(db: Session, user_id: str) -> int:
        """
        Count unread notifications for a user.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            int: Count of unread notifications
        """
        return db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).count()
