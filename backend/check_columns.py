#!/usr/bin/env python3
"""
Check the current database structure
"""

from sqlalchemy import create_engine, text
from config import get_settings

def check_database_columns():
    """Check what columns exist in the users table"""
    engine = create_engine(f"{get_settings().DATABASE_URL}{get_settings().DATABASE_NAME}")
    
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        """))
        
        columns = result.fetchall()
        print("Database columns:")
        for col in columns:
            print(f"  {col[0]}: {col[1]} (nullable: {col[2]})")

if __name__ == "__main__":
    check_database_columns()