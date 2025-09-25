"""
Main FastAPI application for SafeGuard AI Fraud Detection System
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
import os
from dotenv import load_dotenv

from app.routes import health, prediction, blockchain
from app.database.connection import init_db
from app.utils.logger import setup_logger

# Load environment variables
load_dotenv()

# Initialize logger
logger = setup_logger(__name__)

# Create FastAPI app
app = FastAPI(
    title="SafeGuard AI - Fraud Detection System",
    description="AI-Powered 360° Fraud Detection for SMS, URLs, Transactions, and Websites",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080", "https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.your-domain.com"]
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(prediction.router, prefix="/predict", tags=["prediction"])
app.include_router(blockchain.router, prefix="/blockchain", tags=["blockchain"])

@app.on_event("startup")
async def startup_event():
    """Initialize database and other services on startup"""
    try:
        await init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Application shutting down")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
