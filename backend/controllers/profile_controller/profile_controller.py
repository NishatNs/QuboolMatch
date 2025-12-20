from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from repositories.profile_repository.profile_repository import ProfileRepository
from shared.token import Token
from models.user.user import User
import json
import base64
import re

router = APIRouter()


def get_current_user_id(authorization: str = Header(None), db: Session = Depends(get_db)) -> str:
    """Extract and verify user ID from Authorization header"""
    print(f"DEBUG: Authorization header: {authorization}")
    
    if not authorization:
        print("DEBUG: No authorization header")
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    if not authorization.startswith("Bearer "):
        print(f"DEBUG: Invalid header format: {authorization[:20]}")
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.split(" ")[1]
    print(f"DEBUG: Token extracted: {token[:20]}...")
    
    payload = Token.verify_token(token)
    print(f"DEBUG: Token payload: {payload}")
    
    if not payload:
        print("DEBUG: Token verification failed")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("user_id")
    print(f"DEBUG: User ID from token: {user_id}")
    
    if not user_id:
        print("DEBUG: No user_id in payload")
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        print(f"DEBUG: User {user_id} not found in database")
        raise HTTPException(status_code=401, detail="User not found")
    
    print(f"DEBUG: Successfully authenticated user: {user_id}")
    return user_id


def process_base64_file(base64_data: str) -> tuple:
    """
    Convert base64 data URL to binary data
    Returns: (binary_data, filename, content_type)
    """
    if not base64_data or not base64_data.startswith('data:'):
        return None, None, None
    
    try:
        # Extract content type and base64 data
        # Format: data:image/png;base64,iVBORw0KGgoAAAANS...
        match = re.match(r'data:([^;]+);base64,(.+)', base64_data)
        if not match:
            return None, None, None
        
        content_type = match.group(1)
        base64_content = match.group(2)
        
        # Decode base64 to binary
        binary_data = base64.b64decode(base64_content)
        
        # Generate filename based on content type
        extension = content_type.split('/')[-1]
        filename = f"file.{extension}"
        
        return binary_data, filename, content_type
    except Exception as e:
        print(f"Error processing base64 file: {e}")
        return None, None, None


class ProfileCreate(BaseModel):
    # Personal Information
    location: Optional[str] = None
    academic_background: Optional[str] = None
    profession: Optional[str] = None
    marital_status: Optional[str] = None
    hobbies: Optional[str] = None
    intro_video: Optional[str] = None
    
    # Health Information
    medical_history: Optional[str] = None
    overall_health_status: Optional[str] = None
    long_term_condition: Optional[str] = None
    long_term_condition_description: Optional[str] = None
    blood_group: Optional[str] = None
    genetic_conditions: Optional[str] = None  # Accept as string (JSON)
    fertility_awareness: Optional[str] = None
    disability: Optional[str] = None
    disability_description: Optional[str] = None
    medical_documents: Optional[str] = None
    
    # Physical Attributes
    height: Optional[float] = None
    weight: Optional[float] = None
    
    # Lifestyle & Habits
    dietary_preference: Optional[str] = None
    smoking_habit: Optional[str] = None
    alcohol_consumption: Optional[str] = None
    chronic_illness: Optional[str] = None
    interests: Optional[str] = None
    
    # Profile Picture
    profile_picture: Optional[str] = None
    
    # Partner and Marriage Preferences
    preferred_age_min: Optional[int] = None
    preferred_age_max: Optional[int] = None
    preferred_height_min: Optional[float] = None
    preferred_height_max: Optional[float] = None
    preferred_weight_min: Optional[float] = None
    preferred_weight_max: Optional[float] = None
    preferred_religion: Optional[str] = None
    preferred_education: Optional[str] = None
    preferred_profession: Optional[str] = None
    preferred_location: Optional[str] = None
    specific_location: Optional[str] = None
    willing_to_relocate: Optional[bool] = False
    
    # Lifestyle Preferences for Partner
    lifestyle_pref_smoking: Optional[str] = None
    lifestyle_pref_alcohol: Optional[str] = None
    lifestyle_pref_dietary_match: Optional[bool] = False
    
    living_with_in_laws: Optional[str] = None
    career_support_expectations: Optional[str] = None
    necessary_preferences: Optional[str] = None  # Accept as string (JSON)
    additional_comments: Optional[str] = None


class ProfileUpdate(ProfileCreate):
    is_completed: Optional[bool] = None


@router.post("/profile")
async def create_profile(
    profile_data: ProfileCreate,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Create a new profile for the authenticated user"""
    try:
        user_id = get_current_user_id(authorization, db)
        
        # Check if profile already exists
        existing_profile = ProfileRepository.get_by_user_id(db, user_id)
        if existing_profile:
            raise HTTPException(status_code=400, detail="Profile already exists")
        
        # Get profile data
        profile_dict = profile_data.dict()
        # genetic_conditions and necessary_preferences are already strings from frontend
        
        # Process base64 files
        if profile_dict.get('profile_picture'):
            data, filename, content_type = process_base64_file(profile_dict.pop('profile_picture'))
            if data:
                profile_dict['profile_picture_data'] = data
                profile_dict['profile_picture_filename'] = filename
                profile_dict['profile_picture_content_type'] = content_type
        
        if profile_dict.get('intro_video'):
            data, filename, content_type = process_base64_file(profile_dict.pop('intro_video'))
            if data:
                profile_dict['intro_video_data'] = data
                profile_dict['intro_video_filename'] = filename
                profile_dict['intro_video_content_type'] = content_type
        
        if profile_dict.get('medical_documents'):
            data, filename, content_type = process_base64_file(profile_dict.pop('medical_documents'))
            if data:
                profile_dict['medical_documents_data'] = data
                profile_dict['medical_documents_filename'] = filename
                profile_dict['medical_documents_content_type'] = content_type
        
        # Create profile
        profile = ProfileRepository.create(db, user_id, **profile_dict)
        
        return JSONResponse(
            content={"message": "Profile created successfully", "profile": profile.to_dict()},
            status_code=201
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile")
async def get_profile(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Get the authenticated user's profile"""
    try:
        user_id = get_current_user_id(authorization, db)
        
        profile = ProfileRepository.get_by_user_id(db, user_id)
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return JSONResponse(content=profile.to_dict(), status_code=200)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/profile")
async def update_profile(
    profile_data: ProfileUpdate,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Update the authenticated user's profile"""
    try:
        user_id = get_current_user_id(authorization, db)
        
        profile = ProfileRepository.get_by_user_id(db, user_id)
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Get profile data
        profile_dict = profile_data.dict(exclude_unset=True)
        # genetic_conditions and necessary_preferences are already strings from frontend
        
        # Process base64 files
        if 'profile_picture' in profile_dict and profile_dict['profile_picture']:
            data, filename, content_type = process_base64_file(profile_dict.pop('profile_picture'))
            if data:
                profile_dict['profile_picture_data'] = data
                profile_dict['profile_picture_filename'] = filename
                profile_dict['profile_picture_content_type'] = content_type
        
        if 'intro_video' in profile_dict and profile_dict['intro_video']:
            data, filename, content_type = process_base64_file(profile_dict.pop('intro_video'))
            if data:
                profile_dict['intro_video_data'] = data
                profile_dict['intro_video_filename'] = filename
                profile_dict['intro_video_content_type'] = content_type
        
        if 'medical_documents' in profile_dict and profile_dict['medical_documents']:
            data, filename, content_type = process_base64_file(profile_dict.pop('medical_documents'))
            if data:
                profile_dict['medical_documents_data'] = data
                profile_dict['medical_documents_filename'] = filename
                profile_dict['medical_documents_content_type'] = content_type
        
        # Update profile
        updated_profile = ProfileRepository.update(db, profile, **profile_dict)
        
        return JSONResponse(
            content={"message": "Profile updated successfully", "profile": updated_profile.to_dict()},
            status_code=200
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/profile")
async def delete_profile(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Delete the authenticated user's profile"""
    try:
        user_id = get_current_user_id(authorization, db)
        
        profile = ProfileRepository.get_by_user_id(db, user_id)
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        ProfileRepository.delete(db, profile)
        
        return JSONResponse(
            content={"message": "Profile deleted successfully"},
            status_code=200
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profiles")
async def get_all_profiles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all completed profiles (for matching purposes)"""
    try:
        profiles = ProfileRepository.get_all_completed_profiles(db, skip, limit)
        
        return JSONResponse(
            content={"profiles": [profile.to_dict() for profile in profiles]},
            status_code=200
        )
    except Exception as e:
        print(f"Error fetching profiles: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile/{user_id}")
async def get_profile_by_user_id(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific user's profile by user ID"""
    try:
        profile = ProfileRepository.get_by_user_id(db, user_id)
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return JSONResponse(content=profile.to_dict(), status_code=200)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile/picture/{user_id}")
async def get_profile_picture(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get profile picture for a user"""
    try:
        profile = ProfileRepository.get_by_user_id(db, user_id)
        
        if not profile or not profile.profile_picture_data:
            raise HTTPException(status_code=404, detail="Profile picture not found")
        
        return Response(
            content=profile.profile_picture_data,
            media_type=profile.profile_picture_content_type or "image/jpeg"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching profile picture: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile/video/{user_id}")
async def get_intro_video(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get intro video for a user"""
    try:
        profile = ProfileRepository.get_by_user_id(db, user_id)
        
        if not profile or not profile.intro_video_data:
            raise HTTPException(status_code=404, detail="Intro video not found")
        
        return Response(
            content=profile.intro_video_data,
            media_type=profile.intro_video_content_type or "video/mp4"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching intro video: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile/documents/{user_id}")
async def get_medical_documents(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get medical documents for a user"""
    try:
        profile = ProfileRepository.get_by_user_id(db, user_id)
        
        if not profile or not profile.medical_documents_data:
            raise HTTPException(status_code=404, detail="Medical documents not found")
        
        return Response(
            content=profile.medical_documents_data,
            media_type=profile.medical_documents_content_type or "application/pdf"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching medical documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))
