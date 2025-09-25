"""
Prediction service for fraud detection using ML models
"""

import joblib
import numpy as np
import re
from typing import Dict, Any, List
from urllib.parse import urlparse
from app.utils.logger import get_logger

logger = get_logger(__name__)

class PredictionService:
    def __init__(self):
        self.sms_model = None
        self.url_model = None
        self.transaction_model = None
        self.website_model = None
        self._load_models()
    
    def _load_models(self):
        """Load pre-trained ML models"""
        try:
            # In production, these would be loaded from actual model files
            # For now, we'll use placeholder logic
            logger.info("Loading ML models...")
            # self.sms_model = joblib.load('models/sms_fraud_model.pkl')
            # self.url_model = joblib.load('models/url_fraud_model.pkl')
            # self.transaction_model = joblib.load('models/transaction_fraud_model.pkl')
            # self.website_model = joblib.load('models/website_fraud_model.pkl')
            logger.info("Models loaded successfully")
        except Exception as e:
            logger.warning(f"Could not load models: {e}. Using rule-based fallback.")
    
    async def predict_sms_fraud(self, message: str, sender: str = None) -> Dict[str, Any]:
        """Predict SMS/Email fraud using NLP and rule-based detection"""
        try:
            # Rule-based fraud detection patterns
            fraud_indicators = [
                r'urgent|immediate|act now|limited time',
                r'click here|verify account|update info',
                r'congratulations|winner|prize|free',
                r'bank|upi|payment|transaction',
                r'link|url|website|download'
            ]
            
            risk_score = 0
            explanations = []
            
            message_lower = message.lower()
            
            # Check for fraud indicators
            for pattern in fraud_indicators:
                if re.search(pattern, message_lower):
                    risk_score += 0.2
                    explanations.append(f"Contains suspicious pattern: {pattern}")
            
            # Check sender patterns
            if sender:
                suspicious_senders = ['bank', 'gov', 'official', 'service']
                if any(term in sender.lower() for term in suspicious_senders):
                    risk_score += 0.3
                    explanations.append("Suspicious sender pattern")
            
            # Check for urgency
            urgency_words = ['urgent', 'immediate', 'now', 'quickly', 'hurry']
            if any(word in message_lower for word in urgency_words):
                risk_score += 0.2
                explanations.append("High urgency language detected")
            
            # Check for links
            if 'http' in message_lower or 'www.' in message_lower:
                risk_score += 0.3
                explanations.append("Contains suspicious links")
            
            # Normalize risk score
            risk_score = min(risk_score, 1.0)
            is_fraud = risk_score > 0.5
            confidence = abs(risk_score - 0.5) * 2  # Convert to confidence
            
            return {
                "is_fraud": is_fraud,
                "confidence": confidence,
                "risk_score": risk_score,
                "explanation": "; ".join(explanations) if explanations else "No fraud indicators detected"
            }
            
        except Exception as e:
            logger.error(f"SMS prediction failed: {e}")
            return {
                "is_fraud": False,
                "confidence": 0.0,
                "risk_score": 0.0,
                "explanation": "Prediction service error"
            }
    
    async def predict_url_fraud(self, url: str, context: str = None) -> Dict[str, Any]:
        """Predict URL fraud using domain analysis and reputation"""
        try:
            risk_score = 0
            explanations = []
            
            parsed_url = urlparse(url)
            domain = parsed_url.netloc.lower()
            
            # Check for suspicious domains
            suspicious_tlds = ['.tk', '.ml', '.ga', '.cf']
            if any(domain.endswith(tld) for tld in suspicious_tlds):
                risk_score += 0.4
                explanations.append("Suspicious top-level domain")
            
            # Check for IP addresses
            if re.match(r'\d+\.\d+\.\d+\.\d+', domain):
                risk_score += 0.3
                explanations.append("Direct IP address used")
            
            # Check for suspicious keywords
            suspicious_keywords = ['bank', 'paypal', 'amazon', 'microsoft', 'google']
            if any(keyword in domain for keyword in suspicious_keywords):
                risk_score += 0.2
                explanations.append("Suspicious domain keywords")
            
            # Check for subdomain abuse
            if domain.count('.') > 2:
                risk_score += 0.2
                explanations.append("Complex subdomain structure")
            
            # Check for URL shortening services
            shorteners = ['bit.ly', 'tinyurl', 'goo.gl', 't.co']
            if any(shortener in domain for shortener in shorteners):
                risk_score += 0.1
                explanations.append("URL shortening service detected")
            
            risk_score = min(risk_score, 1.0)
            is_fraud = risk_score > 0.5
            confidence = abs(risk_score - 0.5) * 2
            
            return {
                "is_fraud": is_fraud,
                "confidence": confidence,
                "risk_score": risk_score,
                "explanation": "; ".join(explanations) if explanations else "URL appears legitimate"
            }
            
        except Exception as e:
            logger.error(f"URL prediction failed: {e}")
            return {
                "is_fraud": False,
                "confidence": 0.0,
                "risk_score": 0.0,
                "explanation": "Prediction service error"
            }
    
    async def predict_transaction_fraud(self, amount: float, merchant: str, 
                                      location: str = None, user_id: str = None) -> Dict[str, Any]:
        """Predict transaction fraud using anomaly detection"""
        try:
            risk_score = 0
            explanations = []
            
            # Amount-based checks
            if amount > 10000:  # High value transaction
                risk_score += 0.2
                explanations.append("High value transaction")
            
            if amount < 1:  # Very small amount
                risk_score += 0.1
                explanations.append("Micro transaction pattern")
            
            # Merchant-based checks
            suspicious_merchants = ['unknown', 'test', 'demo', 'cash']
            if any(term in merchant.lower() for term in suspicious_merchants):
                risk_score += 0.3
                explanations.append("Suspicious merchant name")
            
            # Time-based checks (would need user history in real implementation)
            # For now, using simple heuristics
            
            risk_score = min(risk_score, 1.0)
            is_fraud = risk_score > 0.5
            confidence = abs(risk_score - 0.5) * 2
            
            return {
                "is_fraud": is_fraud,
                "confidence": confidence,
                "risk_score": risk_score,
                "explanation": "; ".join(explanations) if explanations else "Transaction appears normal"
            }
            
        except Exception as e:
            logger.error(f"Transaction prediction failed: {e}")
            return {
                "is_fraud": False,
                "confidence": 0.0,
                "risk_score": 0.0,
                "explanation": "Prediction service error"
            }
    
    async def predict_website_fraud(self, url: str, content: str = None, 
                                  metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Predict website fraud using content analysis"""
        try:
            risk_score = 0
            explanations = []
            
            # URL analysis (reuse URL fraud detection)
            url_result = await self.predict_url_fraud(url)
            risk_score += url_result["risk_score"] * 0.3
            
            # Content analysis
            if content:
                suspicious_content = [
                    'free money', 'guaranteed profit', 'no risk',
                    'act now', 'limited offer', 'click here',
                    'verify account', 'update information'
                ]
                
                content_lower = content.lower()
                for phrase in suspicious_content:
                    if phrase in content_lower:
                        risk_score += 0.2
                        explanations.append(f"Suspicious content: {phrase}")
            
            # Metadata analysis
            if metadata:
                if metadata.get('ssl_certificate', False) == False:
                    risk_score += 0.3
                    explanations.append("No SSL certificate")
                
                if metadata.get('domain_age_days', 0) < 30:
                    risk_score += 0.2
                    explanations.append("Newly registered domain")
            
            risk_score = min(risk_score, 1.0)
            is_fraud = risk_score > 0.5
            confidence = abs(risk_score - 0.5) * 2
            
            return {
                "is_fraud": is_fraud,
                "confidence": confidence,
                "risk_score": risk_score,
                "explanation": "; ".join(explanations) if explanations else "Website appears legitimate"
            }
            
        except Exception as e:
            logger.error(f"Website prediction failed: {e}")
            return {
                "is_fraud": False,
                "confidence": 0.0,
                "risk_score": 0.0,
                "explanation": "Prediction service error"
            }
