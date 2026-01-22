from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from models.interest.interest import Interest
from typing import List, Optional
from datetime import datetime, timezone


class InterestRepository:
    """Repository class for handling CRUD operations on the Interest model."""

    @staticmethod
    def create(
        db: Session,
        from_user_id: str,
        to_user_id: str,
        message: Optional[str] = None
    ) -> Interest:
        """
        Create a new interest.
        
        Args:
            db: Database session
            from_user_id: ID of the user sending interest
            to_user_id: ID of the user receiving interest
            message: Optional message with the interest
            
        Returns:
            Interest: Created interest object
        """
        interest = Interest(
            from_user_id=from_user_id,
            to_user_id=to_user_id,
            message=message,
            status="pending"
        )
        db.add(interest)
        db.commit()
        db.refresh(interest)
        return interest

    @staticmethod
    def get_by_id(db: Session, interest_id: str) -> Optional[Interest]:
        """Get interest by ID."""
        return db.query(Interest).filter(Interest.id == interest_id).first()

    @staticmethod
    def count_accepted_interests(db: Session, user_id: str) -> int:
        """
        Count number of accepted interests for a user (mutual interests).
        
        Args:
            db: Database session
            user_id: User ID to count accepted interests for
            
        Returns:
            int: Count of accepted interests
        """
        return db.query(Interest).filter(
            and_(
                Interest.status == "accepted",
                or_(
                    Interest.from_user_id == user_id,
                    Interest.to_user_id == user_id
                )
            )
        ).count()

    @staticmethod
    def count_active_sent_interests(db: Session, user_id: str) -> int:
        """
        Count number of active sent interests (pending + accepted) by a user.
        This enforces the 3-interest send limit.
        
        Args:
            db: Database session
            user_id: User ID to count sent interests for
            
        Returns:
            int: Count of active sent interests
        """
        return db.query(Interest).filter(
            and_(
                Interest.from_user_id == user_id,
                Interest.status.in_(["pending", "accepted"])
            )
        ).count()

    @staticmethod
    def check_mutual_interest(db: Session, user1_id: str, user2_id: str) -> bool:
        """
        Check if two users have mutual interest (accepted status).
        
        Args:
            db: Database session
            user1_id: First user ID
            user2_id: Second user ID
            
        Returns:
            bool: True if mutual interest exists, False otherwise
        """
        interest = db.query(Interest).filter(
            and_(
                Interest.status == "accepted",
                or_(
                    and_(Interest.from_user_id == user1_id, Interest.to_user_id == user2_id),
                    and_(Interest.from_user_id == user2_id, Interest.to_user_id == user1_id)
                )
            )
        ).first()
        return interest is not None

    @staticmethod
    def get_existing_interest(db: Session, from_user_id: str, to_user_id: str) -> Optional[Interest]:
        """
        Check if an interest already exists between two users.
        
        Args:
            db: Database session
            from_user_id: Sender user ID
            to_user_id: Receiver user ID
            
        Returns:
            Interest or None: Existing interest if found
        """
        return db.query(Interest).filter(
            and_(
                Interest.from_user_id == from_user_id,
                Interest.to_user_id == to_user_id
            )
        ).first()

    @staticmethod
    def get_received(db: Session, user_id: str, status: Optional[str] = None) -> List[Interest]:
        """
        Get interests received by a user.
        
        Args:
            db: Database session
            user_id: User ID
            status: Optional filter by status (pending, accepted, rejected)
            
        Returns:
            List[Interest]: List of received interests
        """
        query = db.query(Interest).filter(Interest.to_user_id == user_id)
        if status:
            query = query.filter(Interest.status == status)
        return query.order_by(Interest.created_at.desc()).all()

    @staticmethod
    def get_sent(db: Session, user_id: str, status: Optional[str] = None) -> List[Interest]:
        """
        Get interests sent by a user.
        
        Args:
            db: Database session
            user_id: User ID
            status: Optional filter by status (pending, accepted, rejected)
            
        Returns:
            List[Interest]: List of sent interests
        """
        query = db.query(Interest).filter(Interest.from_user_id == user_id)
        if status:
            query = query.filter(Interest.status == status)
        return query.order_by(Interest.created_at.desc()).all()

    @staticmethod
    def update_status(db: Session, interest: Interest, new_status: str) -> Interest:
        """
        Update interest status.
        
        Args:
            db: Database session
            interest: Interest object to update
            new_status: New status (accepted, rejected)
            
        Returns:
            Interest: Updated interest object
        """
        interest.status = new_status
        interest.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(interest)
        return interest

    @staticmethod
    def get_all_accepted(db: Session, user_id: str) -> List[Interest]:
        """
        Get all accepted interests (matches) for a user.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            List[Interest]: List of accepted interests
        """
        return db.query(Interest).filter(
            and_(
                Interest.status == "accepted",
                or_(
                    Interest.from_user_id == user_id,
                    Interest.to_user_id == user_id
                )
            )
        ).order_by(Interest.updated_at.desc()).all()

    @staticmethod
    def delete(db: Session, interest: Interest) -> None:
        """
        Delete an interest (used for canceling sent interests).
        
        Args:
            db: Database session
            interest: Interest object to delete
        """
        db.delete(interest)
        db.commit()
