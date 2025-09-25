"""
Prediction endpoints for fraud detection
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from app.services.prediction_service import PredictionService
from app.services.blockchain_service import BlockchainService
from app.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

# Request models
class SMSRequest(BaseModel):
    message: str
    sender: str = None
    timestamp: str = None

class URLRequest(BaseModel):
    url: str
    context: str = None

class TransactionRequest(BaseModel):
    amount: float
    merchant: str
    location: str = None
    user_id: str = None

class WebsiteRequest(BaseModel):
    url: str
    content: str = None
    metadata: Dict[str, Any] = None

# Response models
class PredictionResponse(BaseModel):
    is_fraud: bool
    confidence: float
    risk_score: float
    explanation: str
    blockchain_hash: str = None

@router.post("/sms", response_model=PredictionResponse)
async def predict_sms_fraud(
    request: SMSRequest,
    prediction_service: PredictionService = Depends(),
    blockchain_service: BlockchainService = Depends()
):
    """Detect SMS/Email spam and phishing attempts"""
    try:
        # Get prediction from ML model
        prediction = await prediction_service.predict_sms_fraud(
            message=request.message,
            sender=request.sender
        )
        
        # Log to blockchain
        blockchain_hash = await blockchain_service.log_prediction({
            "type": "sms",
            "message": request.message,
            "sender": request.sender,
            "prediction": prediction,
            "timestamp": request.timestamp
        })
        
        return PredictionResponse(
            is_fraud=prediction["is_fraud"],
            confidence=prediction["confidence"],
            risk_score=prediction["risk_score"],
            explanation=prediction["explanation"],
            blockchain_hash=blockchain_hash
        )
    except Exception as e:
        logger.error(f"SMS prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@router.post("/url", response_model=PredictionResponse)
async def predict_url_fraud(
    request: URLRequest,
    prediction_service: PredictionService = Depends(),
    blockchain_service: BlockchainService = Depends()
):
    """Detect phishing URLs and malicious websites"""
    try:
        prediction = await prediction_service.predict_url_fraud(
            url=request.url,
            context=request.context
        )
        
        blockchain_hash = await blockchain_service.log_prediction({
            "type": "url",
            "url": request.url,
            "context": request.context,
            "prediction": prediction
        })
        
        return PredictionResponse(
            is_fraud=prediction["is_fraud"],
            confidence=prediction["confidence"],
            risk_score=prediction["risk_score"],
            explanation=prediction["explanation"],
            blockchain_hash=blockchain_hash
        )
    except Exception as e:
        logger.error(f"URL prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@router.post("/transaction", response_model=PredictionResponse)
async def predict_transaction_fraud(
    request: TransactionRequest,
    prediction_service: PredictionService = Depends(),
    blockchain_service: BlockchainService = Depends()
):
    """Detect transaction anomalies and fraud patterns"""
    try:
        prediction = await prediction_service.predict_transaction_fraud(
            amount=request.amount,
            merchant=request.merchant,
            location=request.location,
            user_id=request.user_id
        )
        
        blockchain_hash = await blockchain_service.log_prediction({
            "type": "transaction",
            "amount": request.amount,
            "merchant": request.merchant,
            "location": request.location,
            "user_id": request.user_id,
            "prediction": prediction
        })
        
        return PredictionResponse(
            is_fraud=prediction["is_fraud"],
            confidence=prediction["confidence"],
            risk_score=prediction["risk_score"],
            explanation=prediction["explanation"],
            blockchain_hash=blockchain_hash
        )
    except Exception as e:
        logger.error(f"Transaction prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@router.post("/website", response_model=PredictionResponse)
async def predict_website_fraud(
    request: WebsiteRequest,
    prediction_service: PredictionService = Depends(),
    blockchain_service: BlockchainService = Depends()
):
    """Detect fake e-commerce sites and malicious websites"""
    try:
        prediction = await prediction_service.predict_website_fraud(
            url=request.url,
            content=request.content,
            metadata=request.metadata
        )
        
        blockchain_hash = await blockchain_service.log_prediction({
            "type": "website",
            "url": request.url,
            "content": request.content,
            "metadata": request.metadata,
            "prediction": prediction
        })
        
        return PredictionResponse(
            is_fraud=prediction["is_fraud"],
            confidence=prediction["confidence"],
            risk_score=prediction["risk_score"],
            explanation=prediction["explanation"],
            blockchain_hash=blockchain_hash
        )
    except Exception as e:
        logger.error(f"Website prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")
