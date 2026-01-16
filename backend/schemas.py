from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    userId: str = Field(..., alias="user_id")  # CamelCase for frontend compatibility
    title: str
    description: Optional[str] = None
    completed: bool
    createdAt: datetime = Field(..., alias="created_at")  # CamelCase for frontend compatibility
    updatedAt: datetime = Field(..., alias="updated_at")  # CamelCase for frontend compatibility

    class Config:
        from_attributes = True  # This allows conversion from SQLAlchemy/SQLModel objects