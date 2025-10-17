#!/usr/bin/env python3
"""
Database migration utility script for Alembic
Usage:
    python migrate.py init                      # Initialize Alembic
    python migrate.py create "migration name"   # Create new migration
    python migrate.py upgrade                   # Apply all pending migrations
    python migrate.py downgrade                 # Downgrade by one migration
    python migrate.py current                   # Show current migration version
    python migrate.py history                   # Show migration history
    python migrate.py stamp head                # Mark database as up-to-date
"""

import sys
import subprocess
import os

def run_alembic_command(args):
    """Run alembic command with proper error handling"""
    try:
        result = subprocess.run([sys.executable, "-m", "alembic"] + args, 
                              check=True, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("Warnings:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        return False

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    command = sys.argv[1].lower()

    if command == "init":
        print("Initializing Alembic...")
        run_alembic_command(["init", "alembic"])
        
    elif command == "create":
        if len(sys.argv) < 3:
            print("Usage: python migrate.py create \"migration message\"")
            return
        message = sys.argv[2]
        print(f"Creating migration: {message}")
        run_alembic_command(["revision", "--autogenerate", "-m", message])
        
    elif command == "upgrade":
        print("Applying migrations...")
        run_alembic_command(["upgrade", "head"])
        
    elif command == "downgrade":
        revision = sys.argv[2] if len(sys.argv) > 2 else "-1"
        print(f"Downgrading to: {revision}")
        run_alembic_command(["downgrade", revision])
        
    elif command == "current":
        print("Current migration version:")
        run_alembic_command(["current"])
        
    elif command == "history":
        print("Migration history:")
        run_alembic_command(["history"])
        
    elif command == "stamp":
        revision = sys.argv[2] if len(sys.argv) > 2 else "head"
        print(f"Stamping database as: {revision}")
        run_alembic_command(["stamp", revision])
        
    else:
        print(f"Unknown command: {command}")
        print(__doc__)

if __name__ == "__main__":
    main()