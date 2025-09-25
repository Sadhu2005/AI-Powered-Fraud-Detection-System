"""
Health check endpoints for SafeGuard AI
"""

from fastapi import APIRouter, Depends, HTTPException
from app.services.health_service import HealthService
from app.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.get("/")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "service": "SafeGuard AI Fraud Detection System",
        "version": "1.0.0",
        "message": "Protecting India's Digital Future"
    }

@router.get("/detailed")
async def detailed_health_check(health_service: HealthService = Depends()):
    """Detailed health check with system status"""
    try:
        health_status = await health_service.get_system_health()
        return health_status
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")
