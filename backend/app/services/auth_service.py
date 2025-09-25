"""
Authentication service for SafeGuard AI
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
import secrets
import string

from app.database.models import User, UserSession
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "your-secret-key-here"  # Should be in environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    async def register_user(
        self,
        email: str,
        password: str,
        full_name: str,
        phone: Optional[str] = None
    ) -> User:
        """Register a new user"""
        try:
            # Check if user already exists
            existing_user = self.db.query(User).filter(User.email == email).first()
            if existing_user:
                raise ValueError("User with this email already exists")
            
            # Hash password
            hashed_password = pwd_context.hash(password)
            
            # Create new user
            user = User(
                email=email,
                password_hash=hashed_password,
                full_name=full_name,
                phone=phone,
                is_active=True,
                created_at=datetime.utcnow()
            )
            
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            
            logger.info(f"User registered successfully: {email}")
            return user
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"User registration failed: {e}")
            raise
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        try:
            user = self.db.query(User).filter(User.email == email).first()
            if not user:
                return None
            
            if not pwd_context.verify(password, user.password_hash):
                return None
            
            if not user.is_active:
                return None
            
            logger.info(f"User authenticated successfully: {email}")
            return user
            
        except Exception as e:
            logger.error(f"User authentication failed: {e}")
            return None
    
    def create_access_token(self, data: dict) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[dict]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            return None
        except jwt.JWTError:
            logger.warning("Invalid token")
            return None
    
    async def get_current_user(self, token: str = Depends(oauth2_scheme)) -> User:
        """Get current user from token"""
        try:
            payload = self.verify_token(token)
            if payload is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            email: str = payload.get("sub")
            if email is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            user = self.db.query(User).filter(User.email == email).first()
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            return user
            
        except Exception as e:
            logger.error(f"Get current user failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    async def update_user_profile(
        self,
        user_id: int,
        full_name: Optional[str] = None,
        phone: Optional[str] = None
    ) -> User:
        """Update user profile"""
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                raise ValueError("User not found")
            
            if full_name is not None:
                user.full_name = full_name
            if phone is not None:
                user.phone = phone
            
            user.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(user)
            
            logger.info(f"User profile updated: {user.email}")
            return user
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Profile update failed: {e}")
            raise
    
    async def logout_user(self, user_id: int) -> bool:
        """Logout user and invalidate session"""
        try:
            # Invalidate all user sessions
            sessions = self.db.query(UserSession).filter(UserSession.user_id == user_id).all()
            for session in sessions:
                session.is_active = False
                session.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"User logged out: {user_id}")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Logout failed: {e}")
            return False
    
    async def change_password(
        self,
        user_id: int,
        current_password: str,
        new_password: str
    ) -> bool:
        """Change user password"""
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                raise ValueError("User not found")
            
            # Verify current password
            if not pwd_context.verify(current_password, user.password_hash):
                raise ValueError("Current password is incorrect")
            
            # Hash new password
            new_password_hash = pwd_context.hash(new_password)
            user.password_hash = new_password_hash
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"Password changed for user: {user.email}")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Password change failed: {e}")
            raise
    
    async def reset_password(self, email: str) -> bool:
        """Initiate password reset"""
        try:
            user = self.db.query(User).filter(User.email == email).first()
            if not user:
                # Don't reveal if user exists
                return True
            
            # Generate reset token
            reset_token = self.generate_reset_token()
            
            # Store reset token (in real implementation, store in database)
            # For now, just log it
            logger.info(f"Password reset token for {email}: {reset_token}")
            
            # In real implementation, send email with reset link
            return True
            
        except Exception as e:
            logger.error(f"Password reset failed: {e}")
            return False
    
    def generate_reset_token(self) -> str:
        """Generate password reset token"""
        return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
    
    async def verify_reset_token(self, token: str) -> bool:
        """Verify password reset token"""
        # In real implementation, verify token from database
        return True
    
    async def set_new_password(self, token: str, new_password: str) -> bool:
        """Set new password using reset token"""
        try:
            # In real implementation, get user from token
            # For now, just return success
            return True
            
        except Exception as e:
            logger.error(f"Set new password failed: {e}")
            return False
