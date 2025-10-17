import uuid
import bcrypt
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Date, Time, Text, LargeBinary
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)
    is_deleted = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(
        timezone.utc), nullable=False)
    
    # NID Verification fields
    nid_image_data = Column(LargeBinary, nullable=True)  # Binary data of uploaded NID image
    nid_image_filename = Column(String, nullable=True)  # Original filename
    nid_image_content_type = Column(String, nullable=True)  # MIME type (image/jpeg, etc.)
    verification_date = Column(Date, nullable=True)  # Scheduled verification date
    verification_time = Column(Time, nullable=True)  # Scheduled verification time
    verification_status = Column(String, default="pending")  # pending, in_progress, verified, rejected
    verification_notes = Column(Text, nullable=True)  # Additional notes for verification
    verified_at = Column(DateTime, nullable=True)  # When verification was completed

    def __init__(self, email: String, password: String):
        self.id = str(uuid.uuid4())
        self.email = email
        self.hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        self.is_deleted = False
        self.is_archived = False
        self.verification_status = "pending"

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode(), self.hashed_password.encode())

    def with_email(self, email):
        self.email = email
        return self

    def archive(self):
        self.is_archived = True
        return self

    def delete(self):
        self.is_deleted = True
        return self

    def update_verification_info(self, nid_image_data: bytes = None, nid_image_filename: str = None,
                               nid_image_content_type: str = None, verification_date=None, 
                               verification_time=None, verification_notes: str = None):
        if nid_image_data:
            self.nid_image_data = nid_image_data
        if nid_image_filename:
            self.nid_image_filename = nid_image_filename
        if nid_image_content_type:
            self.nid_image_content_type = nid_image_content_type
        if verification_date:
            self.verification_date = verification_date
        if verification_time:
            self.verification_time = verification_time
        if verification_notes:
            self.verification_notes = verification_notes
        self.verification_status = "in_progress"
        return self

    def verify(self):
        self.verification_status = "verified"
        self.verified_at = datetime.now(timezone.utc)
        return self

    def reject_verification(self, notes: str = None):
        self.verification_status = "rejected"
        if notes:
            self.verification_notes = notes
        return self
