from sqlmodel import SQLModel
from models import User, Task
from db import engine

def create_tables():
    """Create all tables in the database"""
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()