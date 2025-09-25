"""
Authentication routes for SafeGuard AI
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext

from app.database.connection import get_db
from app.database.models import User, UserSession
from app.services.auth_service import AuthService
from app.utils.logger import setup_logger

router = APIRouter()
logger = setup_logger(__name__)

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# JWT settings
SECRET_KEY = "your-secret-key-here"  # Should be in environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

@router.post("/register")
async def register_user(
    email: str,
    password: str,
    full_name: str,
    phone: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    try:
        auth_service = AuthService(db)
        user = await auth_service.register_user(
            email=email,
            password=password,
            full_name=full_name,
            phone=phone
        )
        return {
            "message": "User registered successfully",
            "user_id": user.id,
            "email": user.email
        }
    except Exception as e:
        logger.error(f"Registration failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed"
        )

@router.post("/login")
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user and return access token"""
    try:
        auth_service = AuthService(db)
        user = await auth_service.authenticate_user(
            email=form_data.username,
            password=form_data.password
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = auth_service.create_access_token(
            data={"sub": user.email}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id,
            "email": user.email
        }
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login failed"
        )

@router.get("/profile")
async def get_user_profile(
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user profile"""
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "phone": current_user.phone,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at
    }

@router.put("/profile")
async def update_user_profile(
    full_name: Optional[str] = None,
    phone: Optional[str] = None,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        auth_service = AuthService(db)
        updated_user = await auth_service.update_user_profile(
            user_id=current_user.id,
            full_name=full_name,
            phone=phone
        )
        return {
            "message": "Profile updated successfully",
            "user": updated_user
        }
    except Exception as e:
        logger.error(f"Profile update failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile update failed"
        )

@router.post("/logout")
async def logout_user(
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Logout user and invalidate session"""
    try:
        auth_service = AuthService(db)
        await auth_service.logout_user(current_user.id)
        return {"message": "Logged out successfully"}
    except Exception as e:
        logger.error(f"Logout failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Logout failed"
        )

@router.post("/refresh")
async def refresh_token(
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Refresh access token"""
    try:
        auth_service = AuthService(db)
        new_token = auth_service.create_access_token(
            data={"sub": current_user.email}
        )
        return {
            "access_token": new_token,
            "token_type": "bearer"
        }
    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token refresh failed"
        )
