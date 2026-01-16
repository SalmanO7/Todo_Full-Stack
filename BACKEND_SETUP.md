# Backend API Setup Guide

This frontend application expects a backend API running on `http://localhost:8000` with specific endpoints. This document outlines how to set up the required backend.

## Expected API Endpoints

The frontend expects the following endpoints to be available:

### Task Management Endpoints

- `GET /api/{user_id}/tasks`
  - Query parameters: `status` (all|pending|completed), `sort` (created|title)
  - Response: Array of Task objects

- `POST /api/{user_id}/tasks`
  - Request body: `{ title: string, description?: string }`
  - Response: Created Task object

- `GET /api/{user_id}/tasks/{task_id}`
  - Response: Single Task object

- `PUT /api/{user_id}/tasks/{task_id}`
  - Request body: `{ title?: string, description?: string, completed?: boolean }`
  - Response: Updated Task object

- `DELETE /api/{user_id}/tasks/{task_id}`
  - Response: 204 No Content

- `PATCH /api/{user_id}/tasks/{task_id}/toggle`
  - Response: Updated Task object with toggled completion status

### Authentication Endpoints

The frontend uses Better Auth for authentication, which expects to communicate with the backend auth endpoints.

## Example Backend Implementation (FastAPI)

Here's a basic example of how the backend could be implemented using FastAPI:

```python
from fastapi import FastAPI, HTTPException, Depends
from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional, List
from datetime import datetime
import os
from better_auth import auth_backend

app = FastAPI()

# Task model
class Task(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    user_id: str
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(max_length=1000)
    completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo.db")
engine = create_engine(DATABASE_URL)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# Dependency
def get_session():
    with Session(engine) as session:
        yield session

# API endpoints
@app.get("/api/{user_id}/tasks")
def get_tasks(user_id: str, status: Optional[str] = None, sort: Optional[str] = None):
    with Session(engine) as session:
        statement = select(Task).where(Task.user_id == user_id)

        if status and status != "all":
            if status == "pending":
                statement = statement.where(Task.completed == False)
            elif status == "completed":
                statement = statement.where(Task.completed == True)

        tasks = session.exec(statement).all()

        # Apply sorting
        if sort == "title":
            tasks.sort(key=lambda x: x.title)
        else:  # default sort by created date
            tasks.sort(key=lambda x: x.created_at, reverse=True)

        return tasks

@app.post("/api/{user_id}/tasks")
def create_task(user_id: str, task_data: dict, session: Session = Depends(get_session)):
    task = Task(
        user_id=user_id,
        title=task_data["title"],
        description=task_data.get("description"),
        completed=False
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@app.get("/api/{user_id}/tasks/{task_id}")
def get_task(user_id: str, task_id: str, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/api/{user_id}/tasks/{task_id}")
def update_task(user_id: str, task_id: str, task_data: dict, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task_data.items():
        setattr(task, key, value)
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@app.delete("/api/{user_id}/tasks/{task_id}")
def delete_task(user_id: str, task_id: str, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(task)
    session.commit()
    return {"message": "Task deleted successfully"}

@app.patch("/api/{user_id}/tasks/{task_id}/toggle")
def toggle_task_completion(user_id: str, task_id: str, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)
    return task

# Include Better Auth routes
app.include_router(auth_backend.router, prefix="/auth")
```

## Environment Variables for Backend

The backend should have these environment variables configured:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-sure-it-is-at-least-32-characters-long
```

## Running the Backend

1. Create a new directory for the backend:
```bash
mkdir backend && cd backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install fastapi uvicorn sqlmodel python-multipart better-auth[fastapi]
```

4. Save the example code above to `main.py`

5. Run the backend:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Testing the Integration

Once both frontend and backend are running:

1. Start the backend: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
2. In a new terminal, navigate to the frontend directory and start the frontend: `npm run dev`
3. Open your browser to `http://localhost:3000`
4. You should be able to sign up, sign in, and manage tasks

## Troubleshooting

- If you get CORS errors, make sure your backend allows requests from `http://localhost:3000`
- If authentication isn't working, verify that the `BETTER_AUTH_SECRET` is the same in both frontend and backend
- If API calls are failing, check that the backend is running on port 8000 and the frontend is configured to call the correct endpoints