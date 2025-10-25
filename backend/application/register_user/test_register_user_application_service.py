import uuid
from sqlalchemy.orm import Session
from facade import register_user
from application.register_user.register_user_application_service import UserRegistrationData
from models.user.user import User
import pytest

def test_execute_creates_user(db_session: Session):
    """
    Test that the execute function creates a new user in the database.
    """
    test_uuid = str(uuid.uuid4())
    data = UserRegistrationData(
        name="Test User",
        email=f"{test_uuid}@test.com", 
        password=str(uuid.uuid4()),
        gender="Male",
        nid=f"NID_{test_uuid}",
        age=25,
        religion="Islam",
        preferred_age_from=20,
        preferred_age_to=30
    )
    new_user = register_user(data, db_session)

    # Assert that the correct user object was created
    assert new_user.email == data.email
    assert new_user.name == data.name
    assert new_user.gender == data.gender
    assert new_user.nid == data.nid
    assert new_user.age == data.age
    assert isinstance(new_user, User)

def test_execute_user_already_registered(db_session: Session):
    """
    Test that trying to register a user with an already existing email raises an error.
    """
    # Create a new user first
    test_uuid = str(uuid.uuid4())
    email = f"{test_uuid}@test.com"
    password = str(uuid.uuid4())
    data = UserRegistrationData(
        name="Test User",
        email=email, 
        password=password,
        gender="Male",
        nid=f"NID_{test_uuid}",
        age=25
    )
    register_user(data, db_session)  # First registration

    # Try to register again with the same email
    duplicate_data = UserRegistrationData(
        name="Test User 2",
        email=email, 
        password=str(uuid.uuid4()),
        gender="Female",
        nid=f"NID_{str(uuid.uuid4())}",
        age=28
    )

    # Assert that it raises a ValueError when user is already registered
    with pytest.raises(ValueError, match="User already registered or NID already exists"):
        register_user(duplicate_data, db_session)
