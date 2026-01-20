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
    userId: str
    title: str
    description: Optional[str] = None
    completed: bool
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True  # This allows conversion from SQLAlchemy/SQLModel objects
        allow_population_by_field_name = True  # Allow both aliased and non-aliased field names
        json_encoders = {
            datetime: lambda v: v.isoformat()  # Ensure datetime is serialized as ISO string
        }

    @classmethod
    def from_orm(cls, obj):
        """Custom method to convert SQLModel object to Pydantic model with proper field mapping"""
        return cls(
            id=obj.id,
            userId=obj.user_id,  # Map snake_case to camelCase
            title=obj.title,
            description=obj.description,
            completed=obj.completed,
            createdAt=obj.created_at,  # Map snake_case to camelCase
            updatedAt=obj.updated_at   # Map snake_case to camelCase
        )