import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, Boolean, ForeignKey
from database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)  # interest_received, interest_accepted, interest_rejected, system
    from_user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    related_id = Column(String, nullable=True)  # Reference to interest_id or other entity
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        """Convert notification to dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "type": self.type,
            "from_user_id": self.from_user_id,
            "message": self.message,
            "is_read": self.is_read,
            "related_id": self.related_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
