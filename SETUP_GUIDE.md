# Todo App - Complete Setup Guide

This guide will walk you through setting up both the frontend and backend of the Todo application.

## Prerequisites

- Node.js 18+ (for frontend)
- npm or yarn
- Python 3.8+ (for backend)
- PostgreSQL (or use SQLite for development)
- Git

## Frontend Setup

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update the `.env.local` file with your configuration:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-sure-it-is-at-least-32-characters-long
```

> **Important**: Generate a strong secret key for `BETTER_AUTH_SECRET`. You can use an online generator or run `openssl rand -base64 32` in your terminal.

### 4. Run the frontend

```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

## Backend Setup

### 1. Create the backend directory

```bash
mkdir backend && cd backend
```

### 2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Create the backend application

Create a file called `main.py` with the following content:

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

### 4. Install backend dependencies

```bash
pip install fastapi uvicorn sqlmodel python-multipart better-auth[fastapi] psycopg2-binary
```

### 5. Set up environment variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_app
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-sure-it-is-at-least-32-characters-long
```

### 6. Run the backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at [http://localhost:8000](http://localhost:8000)

## Running Both Together

### Method 1: Manual startup

1. Start the backend: `cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000`
2. In a new terminal, start the frontend: `cd frontend && npm run dev`

### Method 2: Using Docker Compose

If you have Docker installed, you can use the provided `docker-compose.yml`:

```bash
docker-compose up --build
```

Both the frontend and backend will start automatically.

## Testing the Application

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. Click on "Sign Up" to create a new account
3. After signing up, you'll be redirected to the tasks page
4. Try creating, updating, and deleting tasks
5. Test the filtering and sorting functionality
6. Sign out and sign back in to verify authentication works

## Common Issues

### CORS Errors

If you encounter CORS errors, add the following to your FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment Variable Issues

Make sure your `BETTER_AUTH_SECRET` is identical in both frontend and backend environments.

### API Connection Issues

Verify that:
- Backend is running on `http://localhost:8000`
- Frontend is configured with the correct API base URL
- Network requests are not being blocked by firewall or proxy

## Next Steps

1. Customize the UI by modifying components in the `frontend/components/` directory
2. Extend the API with additional endpoints in `backend/main.py`
3. Add more tests to ensure application stability
4. Deploy the application to a cloud provider