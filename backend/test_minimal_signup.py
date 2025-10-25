#!/usr/bin/env python3
"""
Test the updated signup with minimal fields
"""

from sqlalchemy.orm import Session
from database import get_db
from application.register_user.register_user_application_service import UserRegistrationData, execute

def test_minimal_signup():
    """Test signup with only email and password"""
    
    # Test data with only email and password (like frontend sends)
    test_data = UserRegistrationData(
        email="minimal.test@example.com",
        password="testpassword123"
        # All other fields will use defaults
    )
    
    db: Session = next(get_db())
    
    try:
        # Test user registration
        new_user = execute(test_data, db)
        print("✅ Minimal signup successful!")
        print(f"   Name: {new_user.name}")
        print(f"   Email: {new_user.email}")
        print(f"   Gender: {new_user.gender}")
        print(f"   Age: {new_user.age}")
        print(f"   NID: {new_user.nid}")
        print(f"   Religion: {new_user.religion}")
        
        # Test password verification
        if new_user.check_password("testpassword123"):
            print("✅ Password verification works!")
        else:
            print("❌ Password verification failed!")
            
    except Exception as e:
        print(f"❌ Error in minimal signup: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Testing minimal signup (email + password only)...")
    test_minimal_signup()