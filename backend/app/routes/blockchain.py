"""
Blockchain endpoints for fraud registry and verification
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.blockchain_service import BlockchainService
from app.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

class VerificationRequest(BaseModel):
    hash: str

class FraudReportRequest(BaseModel):
    fraud_type: str
    description: str
    evidence: Dict[str, Any]
    reporter_id: str = None

class BlockchainResponse(BaseModel):
    success: bool
    hash: str = None
    block_number: int = None
    message: str

@router.get("/status")
async def get_blockchain_status(blockchain_service: BlockchainService = Depends()):
    """Get blockchain network status"""
    try:
        status = await blockchain_service.get_network_status()
        return status
    except Exception as e:
        logger.error(f"Blockchain status check failed: {e}")
        raise HTTPException(status_code=500, detail="Blockchain service unavailable")

@router.post("/verify", response_model=Dict[str, Any])
async def verify_prediction(
    request: VerificationRequest,
    blockchain_service: BlockchainService = Depends()
):
    """Verify a prediction's blockchain integrity"""
    try:
        verification_result = await blockchain_service.verify_prediction(request.hash)
        return verification_result
    except Exception as e:
        logger.error(f"Blockchain verification failed: {e}")
        raise HTTPException(status_code=500, detail="Verification failed")

@router.post("/report", response_model=BlockchainResponse)
async def report_fraud(
    request: FraudReportRequest,
    blockchain_service: BlockchainService = Depends()
):
    """Report fraud case to blockchain registry"""
    try:
        result = await blockchain_service.report_fraud(
            fraud_type=request.fraud_type,
            description=request.description,
            evidence=request.evidence,
            reporter_id=request.reporter_id
        )
        
        return BlockchainResponse(
            success=True,
            hash=result["hash"],
            block_number=result["block_number"],
            message="Fraud case reported successfully"
        )
    except Exception as e:
        logger.error(f"Fraud reporting failed: {e}")
        raise HTTPException(status_code=500, detail="Fraud reporting failed")

@router.get("/registry")
async def get_fraud_registry(
    limit: int = 100,
    offset: int = 0,
    blockchain_service: BlockchainService = Depends()
):
    """Get fraud registry entries"""
    try:
        registry = await blockchain_service.get_fraud_registry(
            limit=limit,
            offset=offset
        )
        return registry
    except Exception as e:
        logger.error(f"Registry retrieval failed: {e}")
        raise HTTPException(status_code=500, detail="Registry retrieval failed")

@router.get("/stats")
async def get_blockchain_stats(blockchain_service: BlockchainService = Depends()):
    """Get blockchain statistics"""
    try:
        stats = await blockchain_service.get_blockchain_stats()
        return stats
    except Exception as e:
        logger.error(f"Stats retrieval failed: {e}")
        raise HTTPException(status_code=500, detail="Stats retrieval failed")
