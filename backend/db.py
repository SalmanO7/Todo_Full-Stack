from sqlmodel import Session
from sqlalchemy import create_engine
import os
from typing import Generator

# Database URL from environment - using asyncpg driver
# For local testing, you can use a SQLite database instead
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create engine - using asyncpg driver for PostgreSQL or SQLite for local testing
engine = create_engine(DATABASE_URL, echo=False)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session