from sqlmodel import SQLModel, create_engine
import os
from models import User, Task  # Import your models

# Use the DATABASE_URL environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

def reset_database_schema():
    """Reset the database schema by dropping and recreating tables"""
    print("Dropping all tables...")

    # Drop all tables
    SQLModel.metadata.drop_all(engine)

    print("Creating all tables...")

    # Create all tables with the new schema
    SQLModel.metadata.create_all(engine)

    print("Database schema reset successfully!")

def add_missing_columns():
    """Add missing columns to existing tables if needed"""
    import sqlalchemy as sa
    from sqlalchemy import text

    with engine.connect() as conn:
        # Determine database dialect to use appropriate query
        dialect = engine.dialect.name

        column_exists = False
        if dialect == 'postgresql':
            # PostgreSQL query
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'users' AND column_name = 'hashed_password'
            """))
            column_exists = result.fetchone() is not None
        else:
            # SQLite query
            result = conn.execute(text("PRAGMA table_info(users)"))
            columns = [row[1] for row in result.fetchall()]  # Second column is column name
            column_exists = 'hashed_password' in columns

        if not column_exists:
            print("Adding hashed_password column to users table...")
            conn.execute(text("ALTER TABLE users ADD COLUMN hashed_password VARCHAR(255) NOT NULL DEFAULT ''"))
            conn.commit()
            print("hashed_password column added successfully!")
        else:
            print("hashed_password column already exists")

if __name__ == "__main__":
    print("Checking database schema...")
    add_missing_columns()
    print("Database is ready!")