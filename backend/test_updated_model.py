#!/usr/bin/env python3
"""
Test the updated User model with the database
"""

from sqlalchemy.orm import Session
from database import get_db
from models.user.user import User

def test_user_model():
    """Test if the User model works with the current database"""
    db: Session = next(get_db())
    
    try:
        # Try to query existing users
        users = db.query(User).all()
        print(f"✅ Successfully queried {len(users)} users from database")
        
        for user in users:
            print(f"  User: {getattr(user, 'name', 'N/A')} ({user.email})")
            print(f"    Gender: {getattr(user, 'gender', 'N/A')}")
            print(f"    Age: {getattr(user, 'age', 'N/A')}")
            print(f"    NID: {getattr(user, 'nid', 'N/A')}")
            print(f"    Admin: {user.is_admin}")
        
        # Try to create a new user
        test_user = User(
            name="Test User Model",
            email="test.model@example.com",
            password="testpassword123",
            gender="Male",
            nid="NID_TEST_MODEL",
            age=27,
            religion="Islam",
            preferred_age_from=24,
            preferred_age_to=35
        )
        
        db.add(test_user)
        db.commit()
        print("✅ Successfully created new user with updated model")
        
        # Query the new user back
        created_user = db.query(User).filter(User.email == "test.model@example.com").first()
        if created_user:
            print(f"✅ New user verified: {created_user.name} ({created_user.email})")
        
    except Exception as e:
        print(f"❌ Error testing user model: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Testing updated User model...")
    test_user_model()