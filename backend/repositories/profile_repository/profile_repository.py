from sqlalchemy.orm import Session
from models.profile.profile import Profile
from typing import Optional


class ProfileRepository:
    @staticmethod
    def create(db: Session, user_id: str, **kwargs) -> Profile:
        """Create a new profile for a user"""
        profile = Profile(user_id=user_id, **kwargs)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def get_by_user_id(db: Session, user_id: str) -> Optional[Profile]:
        """Get profile by user ID"""
        return db.query(Profile).filter(Profile.user_id == user_id).first()

    @staticmethod
    def get_by_id(db: Session, profile_id: str) -> Optional[Profile]:
        """Get profile by profile ID"""
        return db.query(Profile).filter(Profile.id == profile_id).first()

    @staticmethod
    def update(db: Session, profile: Profile, **kwargs) -> Profile:
        """Update an existing profile"""
        profile.update_profile(**kwargs)
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def delete(db: Session, profile: Profile) -> None:
        """Delete a profile"""
        db.delete(profile)
        db.commit()

    @staticmethod
    def get_all_completed_profiles(db: Session, skip: int = 0, limit: int = 100):
        """Get all completed profiles"""
        return db.query(Profile).filter(
            Profile.is_completed == True
        ).offset(skip).limit(limit).all()

    @staticmethod
    def search_profiles(db: Session, filters: dict, skip: int = 0, limit: int = 100):
        """Search profiles based on filters"""
        query = db.query(Profile).filter(Profile.is_completed == True)
        
        # Apply filters
        if 'preferred_age_min' in filters and 'preferred_age_max' in filters:
            # This would need to be matched against user's age from User table
            pass
        
        if 'location' in filters:
            query = query.filter(Profile.location.ilike(f"%{filters['location']}%"))
        
        if 'religion' in filters:
            query = query.filter(Profile.preferred_religion == filters['religion'])
        
        if 'profession' in filters:
            query = query.filter(Profile.profession.ilike(f"%{filters['profession']}%"))
        
        return query.offset(skip).limit(limit).all()
