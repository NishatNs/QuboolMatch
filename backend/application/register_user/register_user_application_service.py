from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.user.user import User
from shared.transaction_manager import TransactionManager
from typing import Optional


class UserRegistrationData(BaseModel):
    name: str
    email: str
    password: str
    gender: str
    nid: str
    age: int
    religion: Optional[str] = None
    preferred_age_from: Optional[int] = None
    preferred_age_to: Optional[int] = None


def execute(params: UserRegistrationData, db: Session):
    """
    Creates a new user in the database with a transaction.
    """
    transaction_manager = TransactionManager(db)

    try:
        with transaction_manager.transaction() as session:
            # Create a new user object and add it to the session
            new_user = User(
                name=params.name,
                email=params.email,
                password=params.password,
                gender=params.gender,
                nid=params.nid,
                age=params.age,
                religion=params.religion,
                preferred_age_from=params.preferred_age_from,
                preferred_age_to=params.preferred_age_to
            )
            session.add(new_user)

    except IntegrityError as e:
            raise ValueError('User already registered or NID already exists') from e

    return new_user
