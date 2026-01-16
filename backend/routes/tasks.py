from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, desc, asc
from typing import List
from datetime import datetime

from models import Task
from db import get_session
from dependencies import verify_user_ownership, get_current_user
from schemas import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter()


@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(
    user_id: str,
    status_param: str = Query("all", alias="status"),
    sort_param: str = Query("created", alias="sort"),
    current_user: dict = Depends(verify_user_ownership),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the authenticated user with filtering and sorting
    """
    # Build query
    query = select(Task).where(Task.user_id == user_id)

    # Apply status filter
    if status_param == "pending":
        query = query.where(Task.completed == False)
    elif status_param == "completed":
        query = query.where(Task.completed == True)
    # If "all", no additional filter needed

    # Apply sorting
    if sort_param == "title":
        query = query.order_by(asc(Task.title))
    elif sort_param == "created":
        query = query.order_by(desc(Task.created_at))
    # Default is already by created date (desc)

    tasks = session.exec(query).all()
    return tasks


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    task_data: TaskCreate,
    current_user: dict = Depends(verify_user_ownership),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user
    """
    # Validate required fields
    if not task_data.title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required"
        )

    if len(task_data.title) > 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must be 200 characters or less"
        )

    # Create task
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description or "",
        completed=False
    )

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("/tasks/{id}", response_model=TaskResponse)
def get_task(
    user_id: str,
    id: int,
    current_user: dict = Depends(verify_user_ownership),
    session: Session = Depends(get_session)
):
    """
    Get details of a specific task
    """
    task = session.get(Task, id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Insufficient permissions"
        )

    return task


@router.put("/tasks/{id}", response_model=TaskResponse)
def update_task(
    user_id: str,
    id: int,
    task_data: TaskUpdate,
    current_user: dict = Depends(verify_user_ownership),
    session: Session = Depends(get_session)
):
    """
    Update a task for the authenticated user
    """
    task = session.get(Task, id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Insufficient permissions"
        )

    # Update task fields if provided
    if task_data.title is not None:
        if not task_data.title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title is required"
            )
        if len(task_data.title) > 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title must be 200 characters or less"
            )
        task.title = task_data.title

    if task_data.description is not None:
        task.description = task_data.description

    if task_data.completed is not None:
        task.completed = task_data.completed

    # Update the timestamp
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: str,
    id: int,
    current_user: dict = Depends(verify_user_ownership),
    session: Session = Depends(get_session)
):
    """
    Delete a task for the authenticated user
    """
    task = session.get(Task, id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Insufficient permissions"
        )

    session.delete(task)
    session.commit()
    return


@router.patch("/tasks/{id}/complete", response_model=TaskResponse)
def toggle_task_completion(
    user_id: str,
    id: int,
    current_user: dict = Depends(verify_user_ownership),
    session: Session = Depends(get_session)
):
    """
    Toggle task completion status
    """
    task = session.get(Task, id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Insufficient permissions"
        )

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)
    return task