from sqlmodel import Session, SQLModel
from sqlalchemy import create_engine
import os
from typing import Generator
from models import User, Task   # IMPORTANT

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
