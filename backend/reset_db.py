from sqlmodel import SQLModel, Session, select
from models import User, Task
from db import engine
import os
from datetime import datetime

def reset_database():
    """Reset the database by dropping all tables and recreating them"""

    print("Dropping existing tables...")
    # Drop all tables
    SQLModel.metadata.drop_all(engine)

    print("Creating new tables...")
    # Create all tables
    SQLModel.metadata.create_all(engine)

    print("Adding demo user...")
    # Create a demo user
    with Session(engine) as session:
        # Check if demo user already exists
        demo_user = session.exec(select(User).where(User.email == "demo@example.com")).first()

        if not demo_user:
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
        else:
            print("Demo user already exists.")

    print("Database reset complete!")

if __name__ == "__main__":
    reset_database()
    print("\n" + "="*50)
    print("DEMO ACCOUNT INFORMATION:")
    print("Email: demo@example.com")
    print("Password: demo123")  # This is just for demo purposes
    print("="*50)