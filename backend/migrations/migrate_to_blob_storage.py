"""
Migration script to update NID verification fields in the users table
Run this to migrate from file-based storage to database storage
"""

from sqlalchemy import create_engine, text
from config import get_settings

def migrate_to_blob_storage():
    """Update users table to store images as binary data instead of file paths"""
    
    engine = create_engine(get_settings().DATABASE_URL)
    
    migration_queries = [
        # Drop the old file path column if it exists
        """
        ALTER TABLE users 
        DROP COLUMN IF EXISTS nid_image_path;
        """,
        
        # Add new binary storage columns
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS nid_image_data BYTEA,
        ADD COLUMN IF NOT EXISTS nid_image_filename VARCHAR,
        ADD COLUMN IF NOT EXISTS nid_image_content_type VARCHAR;
        """,
        
        # Ensure verification_status has default value
        """
        UPDATE users 
        SET verification_status = 'pending' 
        WHERE verification_status IS NULL;
        """
    ]
    
    try:
        with engine.connect() as connection:
            for query in migration_queries:
                connection.execute(text(query))
            connection.commit()
            print("Successfully migrated to blob storage for NID images")
    except Exception as e:
        print(f"Migration error: {e}")

if __name__ == "__main__":
    migrate_to_blob_storage()