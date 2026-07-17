from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, Response, HTTPException, Form
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from database import get_db
from repositories.user_repository.user_repository import UserRepository
from facade import register_user
from shared.token import Token
from typing import Optional

router = APIRouter()

PASSWORD_REQUIREMENTS = (
    "Password must be 7-128 characters and include uppercase, lowercase, "
    "number, and special character."
)


class UserSignUp(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=7, max_length=128)
    gender: str = Field(min_length=1)
    nid: str = Field(min_length=1)
    age: int = Field(ge=18, le=99)
    religion: Optional[str] = None
    preferred_age_from: int = Field(ge=18, le=99)
    preferred_age_to: int = Field(ge=18, le=99)

    @field_validator("name", "gender", "nid")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("This field is required.")
        return trimmed

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, password: str) -> str:
        has_upper = any(char.isupper() for char in password)
        has_lower = any(char.islower() for char in password)
        has_digit = any(char.isdigit() for char in password)
        has_special = any(not char.isalnum() for char in password)

        if not all([has_upper, has_lower, has_digit, has_special]):
            raise ValueError(PASSWORD_REQUIREMENTS)

        return password

    @model_validator(mode="after")
    def validate_preferred_age_range(self):
        if self.preferred_age_from > self.preferred_age_to:
            raise ValueError("Preferred age range 'From' must be less than or equal to 'To'.")
        return self


@router.post("/sign_up")
async def sign_up(params: UserSignUp, db: Session = Depends(get_db)):
    try:
        new_user = register_user(params, db)
        # Generate access token for the new user
        token = Token.generate_and_sign(user_id=str(new_user.id))
        return JSONResponse(
            content={"access_token": token, "token_type": "bearer"}, 
            status_code=201
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e)) from e


class UserSignIn(BaseModel):
    # Login identifiers may include reserved development domains such as
    # ``quboolmatch.test``. Signup remains strictly validated with EmailStr.
    email: str = Field(min_length=3, max_length=320)
    password: str


@router.post("/sign_in")
async def sign_in(params: UserSignIn, db: Session = Depends(get_db)):
    user = UserRepository.get_by_email(db, params.email.strip().lower())

    if user and user.check_password(params.password):
        token = Token.generate_and_sign(user_id=str(user.id))
        return JSONResponse(content={"access_token": token}, status_code=200)

    raise HTTPException(status_code=401, detail="Incorrect email or password")


@router.post("/admin-login")
async def admin_login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Admin-specific login endpoint that only allows admin users
    """
    user = UserRepository.get_by_email(db, username.strip().lower())

    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    if not user.check_password(password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    token = Token.generate_and_sign(user_id=str(user.id))
    return JSONResponse(content={"access_token": token, "token_type": "bearer"}, status_code=200)
