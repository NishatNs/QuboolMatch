from datetime import datetime, date, time
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Response
from sqlalchemy.orm import Session
from database import get_db
from models.user.user import User
from shared.token import get_current_user
from pydantic import BaseModel
from typing import Optional
import base64

router = APIRouter()

class VerificationResponse(BaseModel):
    success: bool
    message: str
    verification_status: str

class VerificationStatusResponse(BaseModel):
    verification_status: str
    verification_date: Optional[str] = None
    verification_time: Optional[str] = None
    verified_at: Optional[str] = None
    verification_notes: Optional[str] = None
    has_nid_image: bool = False
    nid_image_filename: Optional[str] = None

@router.post("/submit", response_model=VerificationResponse)
async def submit_verification(
    verification_date: str = Form(...),
    verification_time: str = Form(...),
    verification_notes: Optional[str] = Form(None),
    nid_image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit NID verification information including image, date, and time
    """
    try:
        # Validate file type
        if not nid_image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Only image files are allowed")
        
        # Validate file size (5MB limit)
        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
        image_data = await nid_image.read()
        if len(image_data) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")
        
        # Parse date and time
        try:
            parsed_date = datetime.strptime(verification_date, "%Y-%m-%d").date()
            parsed_time = datetime.strptime(verification_time, "%H:%M").time()
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Invalid date or time format: {str(e)}")
        
        # Update user verification info with binary data
        current_user.update_verification_info(
            nid_image_data=image_data,
            nid_image_filename=nid_image.filename,
            nid_image_content_type=nid_image.content_type,
            verification_date=parsed_date,
            verification_time=parsed_time,
            verification_notes=verification_notes
        )
        
        # Commit changes to database
        db.commit()
        
        return VerificationResponse(
            success=True,
            message="Verification information submitted successfully",
            verification_status=current_user.verification_status
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit verification: {str(e)}")

@router.get("/status", response_model=VerificationStatusResponse)
async def get_verification_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current verification status for the user
    """
    return VerificationStatusResponse(
        verification_status=current_user.verification_status,
        verification_date=current_user.verification_date.isoformat() if current_user.verification_date else None,
        verification_time=current_user.verification_time.isoformat() if current_user.verification_time else None,
        verified_at=current_user.verified_at.isoformat() if current_user.verified_at else None,
        verification_notes=current_user.verification_notes,
        has_nid_image=bool(current_user.nid_image_data),
        nid_image_filename=current_user.nid_image_filename
    )

@router.get("/image")
async def get_verification_image(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the NID image for the current user
    """
    if not current_user.nid_image_data:
        raise HTTPException(status_code=404, detail="No NID image found")
    
    return Response(
        content=current_user.nid_image_data,
        media_type=current_user.nid_image_content_type or "image/jpeg"
    )

@router.get("/image/{user_id}")
async def get_user_verification_image(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin endpoint to get NID image for any user
    """
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.nid_image_data:
        raise HTTPException(status_code=404, detail="No NID image found for this user")
    
    return Response(
        content=user.nid_image_data,
        media_type=user.nid_image_content_type or "image/jpeg"
    )

@router.get("/image-base64")
async def get_verification_image_base64(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the NID image as base64 encoded string for the current user
    """
    if not current_user.nid_image_data:
        raise HTTPException(status_code=404, detail="No NID image found")
    
    # Convert binary data to base64
    image_base64 = base64.b64encode(current_user.nid_image_data).decode('utf-8')
    
    return {
        "image_data": image_base64,
        "content_type": current_user.nid_image_content_type,
        "filename": current_user.nid_image_filename
    }

@router.post("/approve/{user_id}")
async def approve_verification(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to approve user verification
    """
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.verify()
    db.commit()
    
    return {"success": True, "message": "User verification approved"}

@router.post("/reject/{user_id}")
async def reject_verification(
    user_id: str,
    rejection_notes: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to reject user verification
    """
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.reject_verification(rejection_notes)
    db.commit()
    
    return {"success": True, "message": "User verification rejected"}

@router.get("/pending")
async def get_pending_verifications(
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to get all pending verifications
    """
    pending_users = db.query(User).filter(
        User.verification_status.in_(["pending", "in_progress"]),
        User.is_deleted == False
    ).all()
    
    return {
        "pending_verifications": [
            {
                "id": user.id,
                "email": user.email,
                "verification_status": user.verification_status,
                "verification_date": user.verification_date.isoformat() if user.verification_date else None,
                "verification_time": user.verification_time.isoformat() if user.verification_time else None,
                "has_nid_image": bool(user.nid_image_data),
                "nid_image_filename": user.nid_image_filename,
                "verification_notes": user.verification_notes,
                "created_at": user.created_at.isoformat()
            }
            for user in pending_users
        ]
    }