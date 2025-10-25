#!/usr/bin/env python3
"""
Final test to verify the updated system works correctly
"""

from sqlalchemy.orm import Session
from database import get_db
from models.user.user import User
from application.register_user.register_user_application_service import UserRegistrationData, execute

def test_complete_signup_flow():
    """Test the complete signup flow with all fields"""
    
    # Test data matching the signup form
    test_data = UserRegistrationData(
        name="Complete Test User",
        email="complete.test@example.com",
        password="securepassword123",
        gender="Male",
        nid="NID_COMPLETE_TEST",
        age=26,
        religion="Islam",
        preferred_age_from=22,
        preferred_age_to=32
    )
    
    db: Session = next(get_db())
    
    try:
        # Test user registration
        new_user = execute(test_data, db)
        print("✅ User registration successful!")
        print(f"   Name: {new_user.name}")
        print(f"   Email: {new_user.email}")
        print(f"   Gender: {new_user.gender}")
        print(f"   Age: {new_user.age}")
        print(f"   NID: {new_user.nid}")
        print(f"   Religion: {new_user.religion}")
        print(f"   Preferred Age: {new_user.preferred_age_from}-{new_user.preferred_age_to}")
        
        # Test password verification
        if new_user.check_password("securepassword123"):
            print("✅ Password verification works!")
        else:
            print("❌ Password verification failed!")
            
        # Test querying users (for admin functionality)
        all_users = db.query(User).all()
        admin_users = db.query(User).filter(User.is_admin == True).all()
        
        print(f"✅ Database query successful!")
        print(f"   Total users: {len(all_users)}")
        print(f"   Admin users: {len(admin_users)}")
        
        # List all users
        print("\n📋 All users in database:")
        for user in all_users:
            print(f"   - {user.name} ({user.email}) - Admin: {user.is_admin}")
            
    except Exception as e:
        print(f"❌ Error in signup flow: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Testing complete signup and admin system...")
    test_complete_signup_flow()
    print("\n✅ System test completed!")