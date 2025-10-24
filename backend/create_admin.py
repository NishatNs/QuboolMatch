"""
Script to create the first admin user
Run this script to create an initial admin user for the system
"""
import os
import sys
from sqlalchemy.orm import Session
from database import get_db, engine
from models.user.user import User

def create_admin_user(email: str, password: str):
    """Create an admin user with the given email and password"""
    db: Session = next(get_db())
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            if existing_user.is_admin:
                print(f"User {email} already exists and is already an admin!")
                return False
            else:
                # Promote existing user to admin
                existing_user.promote_to_admin()
                db.commit()
                print(f"User {email} has been promoted to admin!")
                return True
        
        # Create new admin user
        admin_user = User(email=email, password=password, is_admin=True)
        db.add(admin_user)
        db.commit()
        print(f"Admin user {email} created successfully!")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"Error creating admin user: {str(e)}")
        return False
    finally:
        db.close()

def main():
    """Main function to create admin user interactively"""
    print("=== Create Admin User ===")
    
    email = input("Enter admin email: ").strip()
    if not email:
        print("Email cannot be empty!")
        return
    
    password = input("Enter admin password: ").strip()
    if not password:
        print("Password cannot be empty!")
        return
    
    if len(password) < 6:
        print("Password must be at least 6 characters long!")
        return
    
    success = create_admin_user(email, password)
    if success:
        print("\nAdmin user setup completed successfully!")
        print("You can now log in with these credentials and access admin endpoints.")
    else:
        print("\nFailed to create admin user. Please check the error messages above.")

def create_default_admin():
    """Create a default admin user for development purposes"""
    default_email = "admin@quboolmatch.com"
    default_password = "admin123"
    
    print("Creating default admin user for development...")
    success = create_admin_user(default_email, default_password)
    
    if success:
        print(f"\nDefault admin user created:")
        print(f"Email: {default_email}")
        print(f"Password: {default_password}")
        print("\n⚠️  IMPORTANT: Change this password in production!")
    
    return success

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--default":
        create_default_admin()
    else:
        main()