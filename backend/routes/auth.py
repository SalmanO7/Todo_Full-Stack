from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from sqlmodel import Session, select
from models import User
from db import get_session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional
import os

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token creation
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "G8P173a4T0HV3dBfnNBbyFg1uvcmeWQF")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class AuthResponse(BaseModel):
    session: TokenResponse
    user: dict

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/sign-up/email", response_model=AuthResponse)
async def register_user(user_data: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = get_password_hash(user_data.password)

    # Create new user
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id), "email": db_user.email},
        expires_delta=access_token_expires
    )

    return AuthResponse(
        session=TokenResponse(access_token=access_token, token_type="bearer"),
        user={
            "id": str(db_user.id),
            "email": db_user.email,
            "name": db_user.name
        }
    )

@router.post("/sign-in/email", response_model=AuthResponse)
async def login_user(login_data: UserLogin, session: Session = Depends(get_session)):
    # Find user by email
    user = session.exec(select(User).where(User.email == login_data.email)).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return AuthResponse(
        session=TokenResponse(access_token=access_token, token_type="bearer"),
        user={
            "id": str(user.id),
            "email": user.email,
            "name": user.name
        }
    )

@router.post("/sign-out")
async def sign_out():
    # In a real implementation, you might want to blacklist the token
    # For now, just return a success response
    return {"message": "Signed out successfully"}