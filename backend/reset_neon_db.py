from sqlmodel import SQLModel, Session, select, delete
from models import User, Task
from db import engine
import os
from datetime import datetime

def reset_database():
    """Reset the database by clearing all data and recreating demo content"""

    print("Connecting to database...")

    try:
        print("Clearing all existing data...")
        # Clear all existing data
        with Session(engine) as session:
            # Delete all tasks first (due to foreign key constraint)
            session.exec(delete(Task))
            # Then delete all users
            session.exec(delete(User))
            session.commit()

        print("Adding demo user...")
        # Create a demo user
        with Session(engine) as session:
            demo_user = User(
                id="demo_user_123",
                email="demo@example.com",
                name="Demo User",
                created_at=datetime.utcnow()
            )
            session.add(demo_user)
            session.commit()
            session.refresh(demo_user)

            # Add some sample tasks for the demo user
            sample_tasks = [
                Task(
                    user_id=demo_user.id,
                    title="Welcome to the Todo App!",
                    description="This is a sample task to get you started.",
                    completed=False,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
                Task(
                    user_id=demo_user.id,
                    title="Try checking this task",
                    description="Click the checkbox to mark this task as completed.",
                    completed=False,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
                Task(
                    user_id=demo_user.id,
                    title="Create your own tasks",
                    description="Click the 'Add Task' button to create new tasks.",
                    completed=False,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
            ]

            for task in sample_tasks:
                session.add(task)

            session.commit()
            print("Sample data added for demo user.")

        print("Database reset complete!")

    except Exception as e:
        print(f"Error resetting database: {str(e)}")
        print("Make sure your PostgreSQL connection is configured correctly in the DATABASE_URL environment variable.")

if __name__ == "__main__":
    reset_database()
    print("\n" + "="*50)
    print("DEMO ACCOUNT INFORMATION:")
    print("Email: demo@example.com")
    print("Password: demo123")  # This is just for demo purposes
    print("="*50)
    print("\nTo use with Neon PostgreSQL:")
    print("1. Update the DATABASE_URL in .env with your actual Neon connection string")
    print("2. Run: python reset_db.py")
    print("3. Start the backend server")
    print("4. Access the app with the demo credentials above")