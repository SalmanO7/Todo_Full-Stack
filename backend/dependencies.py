from fastapi import HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
from jose import jwt, JWTError
from typing import Dict, Optional
from db import get_session
from models import User
import os

# Create optional security for development
security = HTTPBearer(auto_error=False)

def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """
    Verify JWT token and extract user information
    Always allow mock user ID from header in development mode
    """
    BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET", "G8P173a4T0HV3dBfnNBbyFg1uvcmeWQF")

    # Always check for mock user ID header first for development
    mock_user_id = request.headers.get("X-Mock-User-ID")
    if mock_user_id:
        return {
            "user_id": mock_user_id,
            "email": f"{mock_user_id}@gmail.com"
            
        }

    # If no credentials provided, default to dev user (development mode)
    if not credentials or not credentials.credentials:
        return {
            "user_id": "dev-user-id",
            "email": "dev@example.com"
        }

    # Otherwise, validate the JWT token (production mode)
    token = credentials.credentials

    try:
        # Decode the JWT token
        payload = jwt.decode(token, BETTER_AUTH_SECRET, algorithms=["HS256"])

        # Extract user information from the token
        user_id: str = payload.get("sub")  # subject (user id)
        email: str = payload.get("email")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Return user information
        return {
            "user_id": user_id,
            "email": email
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_user_ownership(user_id: str, current_user: Dict = Depends(get_current_user)):
    """
    Verify that the requested user ID matches the authenticated user's ID
    Allow all access in development mode
    """
    # Check if we're in development mode
    is_development = os.getenv("ENVIRONMENT", "development") != "production"

    # In development mode, allow access (skip user isolation)
    if is_development:
        return

    # In production, enforce strict user ownership
    if user_id != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Insufficient permissions"
        )