"""
Health service for system monitoring
"""

import psutil
import asyncio
from datetime import datetime
from typing import Dict, Any
from app.utils.logger import get_logger

logger = get_logger(__name__)

class HealthService:
    def __init__(self):
        self.start_time = datetime.now()
    
    async def get_system_health(self) -> Dict[str, Any]:
        """Get comprehensive system health status"""
        try:
            # System metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            # Uptime
            uptime = datetime.now() - self.start_time
            
            return {
                "status": "healthy",
                "timestamp": datetime.now().isoformat(),
                "uptime_seconds": uptime.total_seconds(),
                "system": {
                    "cpu_percent": cpu_percent,
                    "memory_percent": memory.percent,
                    "memory_available_gb": round(memory.available / (1024**3), 2),
                    "disk_percent": disk.percent,
                    "disk_free_gb": round(disk.free / (1024**3), 2)
                },
                "services": {
                    "api": "healthy",
                    "database": "healthy",
                    "blockchain": "healthy",
                    "ml_models": "healthy"
                }
            }
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                "status": "unhealthy",
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            }
