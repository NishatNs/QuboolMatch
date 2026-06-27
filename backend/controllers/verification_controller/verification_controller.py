import json
from difflib import SequenceMatcher
from datetime import date, datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Response
from sqlalchemy.orm import Session
from database import get_db
from models.user.user import User
from models.verification_rejection import VerificationRejection
from shared.token import get_current_user, get_current_admin_user
from pydantic import BaseModel, Field
import base64
from services.gemini_nid_ocr_service import (
    NIDOcrExtractionError,
    NIDOcrExtractionResult,
    ocr_service,
)

router = APIRouter()

ALLOWED_NID_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_NID_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

class VerificationResponse(BaseModel):
    success: bool
    message: str
    verification_status: str

class VerificationStatusResponse(BaseModel):
    verification_status: str
    name: Optional[str] = None
    age: Optional[int] = None
    date_of_birth: Optional[str] = None
    nid: Optional[str] = None
    verified_at: Optional[str] = None
    verification_notes: Optional[str] = None
    rejection_notes: Optional[str] = None
    ocr_name: Optional[str] = None
    ocr_father_name: Optional[str] = None
    ocr_mother_name: Optional[str] = None
    ocr_date_of_birth: Optional[str] = None
    ocr_nid_number: Optional[str] = None
    ocr_nid_masked: Optional[str] = None
    ocr_blood_group: Optional[str] = None
    ocr_image_quality: Optional[str] = None
    ocr_warnings: list[str] = Field(default_factory=list)
    ocr_confirmed: bool = False
    ocr_processed_at: Optional[str] = None
    ocr_name_match_score: Optional[float] = None
    ocr_name_match_status: Optional[str] = None
    ocr_nid_match: Optional[bool] = None
    ocr_dob_match: Optional[bool] = None
    ocr_review_status: Optional[str] = None
    admin_review_notes: Optional[str] = None
    has_nid_image: bool = False
    nid_image_filename: Optional[str] = None


class PendingVerificationUserResponse(BaseModel):
    id: str
    name: Optional[str] = None
    email: str
    age: Optional[int] = None
    date_of_birth: Optional[str] = None
    nid: Optional[str] = None
    verification_status: str
    verification_notes: Optional[str] = None
    guardian_verification_status: str
    has_nid_image: bool = False
    nid_image_filename: Optional[str] = None
    created_at: str
    ocr_name: Optional[str] = None
    ocr_father_name: Optional[str] = None
    ocr_mother_name: Optional[str] = None
    ocr_date_of_birth: Optional[str] = None
    ocr_nid_number: Optional[str] = None
    ocr_nid_masked: Optional[str] = None
    ocr_image_quality: Optional[str] = None
    ocr_warnings: list[str] = Field(default_factory=list)
    ocr_confirmed: bool = False
    ocr_processed_at: Optional[str] = None
    ocr_name_match_score: Optional[float] = None
    ocr_name_match_status: Optional[str] = None
    ocr_nid_match: Optional[bool] = None
    ocr_dob_match: Optional[bool] = None
    ocr_review_status: Optional[str] = None
    admin_review_notes: Optional[str] = None


class PendingVerificationsResponse(BaseModel):
    pending_verifications: list[PendingVerificationUserResponse]


class OcrConfirmationUpdateRequest(BaseModel):
    ocr_confirmed: bool


class OcrConfirmationUpdateResponse(BaseModel):
    success: bool
    message: str
    ocr_confirmed: bool


class NIDOcrExtractionResponse(BaseModel):
    success: bool
    message: str
    document_detected: bool = False
    name: Optional[str] = None
    father_name: Optional[str] = None
    mother_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    nid_number: Optional[str] = None
    image_quality: Optional[str] = None
    warnings: list[str] = Field(default_factory=list)


def _build_ocr_response(
    *,
    success: bool,
    message: str,
    extraction: Optional[NIDOcrExtractionResult] = None,
) -> NIDOcrExtractionResponse:
    if not extraction:
        return NIDOcrExtractionResponse(
            success=success,
            message=message,
            warnings=[],
        )

    return NIDOcrExtractionResponse(
        success=success,
        message=message,
        document_detected=extraction.document_detected,
        name=extraction.name,
        father_name=extraction.father_name,
        mother_name=extraction.mother_name,
        date_of_birth=extraction.date_of_birth,
        nid_number=extraction.nid_number,
        image_quality=extraction.image_quality,
        warnings=extraction.warnings,
    )


def _parse_ocr_date(value: Optional[str]) -> Optional[date]:
    if not value:
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None


def _normalize_ocr_warnings(value) -> Optional[list[str]]:
    if value is None:
        return None

    if isinstance(value, list):
        normalized = [str(item).strip() for item in value if str(item).strip()]
        return normalized or None

    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return None

        try:
            parsed = json.loads(stripped)
        except json.JSONDecodeError:
            return [stripped]

        if isinstance(parsed, list):
            normalized = [str(item).strip() for item in parsed if str(item).strip()]
            return normalized or None
        if isinstance(parsed, str) and parsed.strip():
            return [parsed.strip()]
        return None

    return [str(value).strip()] if str(value).strip() else None


def _normalize_text_for_comparison(value: Optional[str]) -> str:
    if not value:
        return ""
    return " ".join(value.strip().lower().split())


def _mask_nid_number(value: Optional[str]) -> Optional[str]:
    if not value:
        return None

    trimmed = value.strip()
    if not trimmed:
        return None

    return trimmed.replace(" ", "").replace("-", "").replace(".", "").replace("\u00b7", "")


def _format_nid_masked(value: Optional[str]) -> Optional[str]:
    normalized = _mask_nid_number(value)
    if not normalized:
        return None

    if len(normalized) <= 4:
        return normalized

    return "*" * (len(normalized) - 4) + normalized[-4:]


def _compute_name_match_score(submitted_name: Optional[str], ocr_name: Optional[str]) -> Optional[float]:
    normalized_submitted = _normalize_text_for_comparison(submitted_name)
    normalized_ocr = _normalize_text_for_comparison(ocr_name)
    if not normalized_submitted or not normalized_ocr:
        return None

    return round(SequenceMatcher(None, normalized_submitted, normalized_ocr).ratio(), 4)


def _derive_name_match_status(
    submitted_name: Optional[str],
    ocr_name: Optional[str],
    score: Optional[float],
) -> Optional[str]:
    if not _normalize_text_for_comparison(submitted_name) or not _normalize_text_for_comparison(ocr_name):
        return None

    if score is None:
        return None

    if score >= 0.9:
        return "matched"
    if score >= 0.65:
        return "needs_review"
    return "does_not_match"


def _derive_nid_match(submitted_nid: Optional[str], ocr_nid: Optional[str]) -> Optional[bool]:
    normalized_submitted = _normalize_text_for_comparison(submitted_nid)
    normalized_ocr = _normalize_text_for_comparison(ocr_nid)
    if not normalized_submitted or not normalized_ocr:
        return None

    return normalized_submitted == normalized_ocr


def _derive_dob_match(
    submitted_date_of_birth: Optional[date],
    submitted_age: Optional[int],
    ocr_date_of_birth: Optional[date],
) -> Optional[bool]:
    if submitted_date_of_birth and ocr_date_of_birth:
        return submitted_date_of_birth == ocr_date_of_birth

    if submitted_age is not None and ocr_date_of_birth:
        today = date.today()
        derived_age = today.year - ocr_date_of_birth.year - (
            (today.month, today.day) < (ocr_date_of_birth.month, ocr_date_of_birth.day)
        )
        return derived_age == submitted_age

    return None


def _build_comparison_payload(user: User) -> dict[str, object]:
    ocr_date_of_birth = user.ocr_date_of_birth.isoformat() if user.ocr_date_of_birth else None
    ocr_name_match_score = user.ocr_name_match_score
    if ocr_name_match_score is None:
        ocr_name_match_score = _compute_name_match_score(user.name, user.ocr_name)

    ocr_name_match_status = user.ocr_name_match_status
    if ocr_name_match_status is None:
        ocr_name_match_status = _derive_name_match_status(user.name, user.ocr_name, ocr_name_match_score)

    ocr_nid_match = user.ocr_nid_match
    if ocr_nid_match is None:
        ocr_nid_match = _derive_nid_match(user.nid, user.ocr_nid_number)

    ocr_dob_match = user.ocr_dob_match
    if ocr_dob_match is None:
        ocr_dob_match = _derive_dob_match(user.date_of_birth, user.age, user.ocr_date_of_birth)

    ocr_review_status = user.ocr_review_status or ("pending_review" if user.ocr_processed_at else None)

    return {
        "ocr_name_match_score": ocr_name_match_score,
        "ocr_name_match_status": ocr_name_match_status,
        "ocr_nid_match": ocr_nid_match,
        "ocr_dob_match": ocr_dob_match,
        "ocr_review_status": ocr_review_status,
        "admin_review_notes": user.admin_review_notes,
        "ocr_date_of_birth": ocr_date_of_birth,
        "ocr_nid_masked": _format_nid_masked(user.ocr_nid_number),
    }


def _build_pending_user_response(user: User) -> PendingVerificationUserResponse:
    comparison_payload = _build_comparison_payload(user)
    return PendingVerificationUserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        age=user.age,
        date_of_birth=user.date_of_birth.isoformat() if user.date_of_birth else None,
        nid=user.nid,
        verification_status=user.verification_status,
        verification_notes=user.verification_notes,
        guardian_verification_status=user.guardian_verification_status,
        has_nid_image=bool(user.nid_image_data),
        nid_image_filename=user.nid_image_filename,
        created_at=user.created_at.isoformat(),
        ocr_name=user.ocr_name,
        ocr_father_name=user.ocr_father_name,
        ocr_mother_name=user.ocr_mother_name,
        ocr_date_of_birth=comparison_payload["ocr_date_of_birth"],
        ocr_nid_number=user.ocr_nid_number,
        ocr_nid_masked=comparison_payload["ocr_nid_masked"],
        ocr_image_quality=user.ocr_image_quality,
        ocr_warnings=_normalize_ocr_warnings(user.ocr_warnings) or [],
        ocr_confirmed=bool(user.ocr_confirmed),
        ocr_processed_at=user.ocr_processed_at.isoformat() if user.ocr_processed_at else None,
        ocr_name_match_score=comparison_payload["ocr_name_match_score"],
        ocr_name_match_status=comparison_payload["ocr_name_match_status"],
        ocr_nid_match=comparison_payload["ocr_nid_match"],
        ocr_dob_match=comparison_payload["ocr_dob_match"],
        ocr_review_status=comparison_payload["ocr_review_status"],
        admin_review_notes=comparison_payload["admin_review_notes"],
    )


@router.post("/extract-nid", response_model=NIDOcrExtractionResponse)
async def extract_nid_information(
    nid_image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Extract OCR data from the front side of a Bangladesh NID using Gemini.
    """
    try:
        if not nid_image.content_type or nid_image.content_type.lower() not in ALLOWED_NID_IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Only JPEG, PNG, and WebP images are allowed for NID OCR",
            )

        nid_image_data = await nid_image.read()
        if not nid_image_data:
            raise HTTPException(status_code=400, detail="NID image file cannot be empty")

        if len(nid_image_data) > MAX_NID_IMAGE_SIZE_BYTES:
            raise HTTPException(status_code=413, detail="NID image file size exceeds 5MB limit")

        try:
            extraction = ocr_service.extract(
                image_data=nid_image_data,
                content_type=nid_image.content_type,
            )
        except NIDOcrExtractionError:
            return _build_ocr_response(
                success=False,
                message="We could not extract NID information at this time. Please try again.",
            )

        if not extraction.document_detected:
            return _build_ocr_response(
                success=False,
                message="No front side of a Bangladesh NID was detected in the uploaded image.",
                extraction=extraction,
            )

        parsed_date_of_birth = _parse_ocr_date(extraction.date_of_birth)
        warnings = list(extraction.warnings)
        if extraction.date_of_birth and not parsed_date_of_birth:
            warnings.append("Date of birth could not be parsed")

        current_user.update_ocr_extraction(
            ocr_name=extraction.name,
            ocr_father_name=extraction.father_name,
            ocr_mother_name=extraction.mother_name,
            ocr_date_of_birth=parsed_date_of_birth,
            ocr_nid_number=extraction.nid_number,
            ocr_image_quality=extraction.image_quality,
            ocr_warnings=warnings,
            processed_at=datetime.now(timezone.utc),
        )

        comparison_payload = _build_comparison_payload(current_user)
        current_user.ocr_name_match_score = comparison_payload["ocr_name_match_score"]
        current_user.ocr_name_match_status = comparison_payload["ocr_name_match_status"]
        current_user.ocr_nid_match = comparison_payload["ocr_nid_match"]
        current_user.ocr_dob_match = comparison_payload["ocr_dob_match"]
        current_user.ocr_review_status = comparison_payload["ocr_review_status"]
        current_user.admin_review_notes = comparison_payload["admin_review_notes"]

        try:
            db.commit()
        except Exception:
            db.rollback()
            return _build_ocr_response(
                success=False,
                message="We could not save the extracted NID information. Please try again.",
                extraction=extraction,
            )

        return _build_ocr_response(
            success=True,
            message="NID information extracted successfully",
            extraction=NIDOcrExtractionResult(
                document_detected=True,
                name=current_user.ocr_name,
                father_name=current_user.ocr_father_name,
                mother_name=current_user.ocr_mother_name,
                date_of_birth=current_user.ocr_date_of_birth.isoformat() if current_user.ocr_date_of_birth else None,
                nid_number=current_user.ocr_nid_number,
                image_quality=current_user.ocr_image_quality,
                warnings=current_user.ocr_warnings or [],
            ),
        )
    except HTTPException:
        raise
    except Exception:
        db.rollback()
        return _build_ocr_response(
            success=False,
            message="We could not extract NID information at this time. Please try again.",
        )

@router.post("/submit", response_model=VerificationResponse)
async def submit_verification(
    verification_notes: Optional[str] = Form(None),
    nid_image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit NID verification information including NID image and optional notes
    """
    try:
        # Validate NID image file type
        if not nid_image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Only image files are allowed for NID image")
        
        # Validate file size (5MB limit)
        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
        nid_image_data = await nid_image.read()
        if len(nid_image_data) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="NID image file size exceeds 5MB limit")
        
        # Update user verification info with binary data
        current_user.update_verification_info(
            nid_image_data=nid_image_data,
            nid_image_filename=nid_image.filename,
            nid_image_content_type=nid_image.content_type,
            verification_notes=verification_notes
        )
        db.query(VerificationRejection).filter(
            VerificationRejection.user_id == current_user.id
        ).delete()
        
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
    rejection = db.query(VerificationRejection).filter(
        VerificationRejection.user_id == current_user.id
    ).first()

    comparison_payload = _build_comparison_payload(current_user)

    return VerificationStatusResponse(
        verification_status=current_user.verification_status,
        name=current_user.name,
        age=current_user.age,
        date_of_birth=current_user.date_of_birth.isoformat() if current_user.date_of_birth else None,
        nid=current_user.nid,
        verified_at=current_user.verified_at.isoformat() if current_user.verified_at else None,
        verification_notes=current_user.verification_notes,
        rejection_notes=rejection.notes if rejection else None,
        ocr_name=current_user.ocr_name,
        ocr_father_name=current_user.ocr_father_name,
        ocr_mother_name=current_user.ocr_mother_name,
        ocr_date_of_birth=current_user.ocr_date_of_birth.isoformat() if current_user.ocr_date_of_birth else None,
        ocr_nid_number=current_user.ocr_nid_number,
        ocr_nid_masked=comparison_payload["ocr_nid_masked"],
        ocr_blood_group=getattr(current_user, "ocr_blood_group", None),
        ocr_image_quality=current_user.ocr_image_quality,
        ocr_warnings=_normalize_ocr_warnings(current_user.ocr_warnings) or [],
        ocr_confirmed=bool(current_user.ocr_confirmed),
        ocr_processed_at=current_user.ocr_processed_at.isoformat() if current_user.ocr_processed_at else None,
        ocr_name_match_score=comparison_payload["ocr_name_match_score"],
        ocr_name_match_status=comparison_payload["ocr_name_match_status"],
        ocr_nid_match=comparison_payload["ocr_nid_match"],
        ocr_dob_match=comparison_payload["ocr_dob_match"],
        ocr_review_status=comparison_payload["ocr_review_status"],
        admin_review_notes=comparison_payload["admin_review_notes"],
        has_nid_image=bool(current_user.nid_image_data),
        nid_image_filename=current_user.nid_image_filename,
    )


@router.put("/ocr-confirmation", response_model=OcrConfirmationUpdateResponse)
async def update_ocr_confirmation(
    request: OcrConfirmationUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        current_user.ocr_confirmed = request.ocr_confirmed
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update OCR confirmation")

    return OcrConfirmationUpdateResponse(
        success=True,
        message="OCR confirmation updated successfully",
        ocr_confirmed=current_user.ocr_confirmed,
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
    current_admin: User = Depends(get_current_admin_user)
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
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Admin endpoint to approve user verification
    """
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.verify()
    db.query(VerificationRejection).filter(
        VerificationRejection.user_id == user_id
    ).delete()
    db.commit()
    
    return {"success": True, "message": "User verification approved"}

@router.post("/reject/{user_id}")
async def reject_verification(
    user_id: str,
    rejection_notes: str = Form(...),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Admin endpoint to reject user verification
    """
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.reject_verification(rejection_notes)
    existing_rejection = db.query(VerificationRejection).filter(
        VerificationRejection.user_id == user_id
    ).first()
    if existing_rejection:
        existing_rejection.notes = rejection_notes
    else:
        db.add(VerificationRejection(user_id=user_id, notes=rejection_notes))
    db.commit()
    
    return {"success": True, "message": "User verification rejected"}

@router.post("/guardian/approve/{user_id}")
async def approve_guardian_verification(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Admin endpoint to approve guardian verification
    """
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.verify_guardian()
    db.commit()

    return {"success": True, "message": "Guardian verification approved"}

@router.post("/guardian/reject/{user_id}")
async def reject_guardian_verification(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Admin endpoint to reject guardian verification
    """
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.reject_guardian_verification()
    db.commit()

    return {"success": True, "message": "Guardian verification rejected"}

@router.get("/pending", response_model=PendingVerificationsResponse)
async def get_pending_verifications(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Admin endpoint to get all pending verifications
    """
    pending_users = db.query(User).filter(
        User.verification_status.in_(["pending", "in_progress"]),
        User.is_deleted == False
    ).all()
    
    return PendingVerificationsResponse(
        pending_verifications=[_build_pending_user_response(user) for user in pending_users]
    )
