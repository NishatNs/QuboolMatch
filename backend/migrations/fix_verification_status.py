"""
Migration script to fix verification status for users who haven't submitted verification info yet.
Sets verification_status to 'not_submitted' for users who are marked as 'pending' but have no NID image data.
"""

import sys
import os

# Add parent directory to path so we can import config
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from config import get_settings

settings = get_settings()
DATABASE_URL = f"{settings.DATABASE_URL}{settings.DATABASE_NAME}"

def run_migration():
    """
    Update verification_status from 'pending' to 'not_submitted' 
    for users who haven't actually submitted their verification info yet
    """
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Update users who are marked as pending but have no NID image data
        result = session.execute(
            text("""
                UPDATE users 
                SET verification_status = 'not_submitted' 
                WHERE verification_status = 'pending' 
                AND nid_image_data IS NULL
            """)
        )
        
        session.commit()
        print(f"✅ Migration completed successfully!")
        print(f"   Updated {result.rowcount} user(s) from 'pending' to 'not_submitted'")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Migration failed: {str(e)}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    print("🔄 Running verification status migration...")
    run_migration()
