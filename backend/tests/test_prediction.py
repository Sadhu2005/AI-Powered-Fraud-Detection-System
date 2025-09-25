"""
Tests for prediction service
"""

import pytest
from unittest.mock import Mock, patch
from app.services.prediction_service import PredictionService

class TestPredictionService:
    def setup_method(self):
        self.prediction_service = PredictionService()
    
    @pytest.mark.asyncio
    async def test_predict_sms_fraud_legitimate(self):
        """Test SMS prediction for legitimate message"""
        message = "Hello, this is a normal message from your bank."
        sender = "BANK123"
        
        result = await self.prediction_service.predict_sms_fraud(message, sender)
        
        assert result is not None
        assert "is_fraud" in result
        assert "confidence" in result
        assert "risk_score" in result
        assert "explanation" in result
        assert isinstance(result["is_fraud"], bool)
        assert 0 <= result["confidence"] <= 1
        assert 0 <= result["risk_score"] <= 1
    
    @pytest.mark.asyncio
    async def test_predict_sms_fraud_suspicious(self):
        """Test SMS prediction for suspicious message"""
        message = "URGENT! Click here immediately to verify your account or it will be blocked!"
        sender = "BANK-ALERT"
        
        result = await self.prediction_service.predict_sms_fraud(message, sender)
        
        assert result is not None
        assert result["is_fraud"] is True
        assert result["risk_score"] > 0.5
        assert "urgent" in result["explanation"].lower() or "suspicious" in result["explanation"].lower()
    
    @pytest.mark.asyncio
    async def test_predict_url_fraud_legitimate(self):
        """Test URL prediction for legitimate URL"""
        url = "https://www.google.com"
        
        result = await self.prediction_service.predict_url_fraud(url)
        
        assert result is not None
        assert "is_fraud" in result
        assert "confidence" in result
        assert "risk_score" in result
        assert "explanation" in result
    
    @pytest.mark.asyncio
    async def test_predict_url_fraud_suspicious(self):
        """Test URL prediction for suspicious URL"""
        url = "http://bank-security-verification.tk/verify-account"
        
        result = await self.prediction_service.predict_url_fraud(url)
        
        assert result is not None
        assert result["is_fraud"] is True
        assert result["risk_score"] > 0.5
    
    @pytest.mark.asyncio
    async def test_predict_transaction_fraud_normal(self):
        """Test transaction prediction for normal transaction"""
        amount = 100.0
        merchant = "Amazon"
        
        result = await self.prediction_service.predict_transaction_fraud(amount, merchant)
        
        assert result is not None
        assert "is_fraud" in result
        assert "confidence" in result
        assert "risk_score" in result
        assert "explanation" in result
    
    @pytest.mark.asyncio
    async def test_predict_transaction_fraud_high_value(self):
        """Test transaction prediction for high value transaction"""
        amount = 50000.0
        merchant = "Unknown Merchant"
        
        result = await self.prediction_service.predict_transaction_fraud(amount, merchant)
        
        assert result is not None
        assert result["risk_score"] > 0.2  # Should have some risk due to high amount
    
    @pytest.mark.asyncio
    async def test_predict_website_fraud_legitimate(self):
        """Test website prediction for legitimate website"""
        url = "https://www.amazon.com"
        content = "Welcome to Amazon - Your trusted online shopping destination"
        
        result = await self.prediction_service.predict_website_fraud(url, content)
        
        assert result is not None
        assert "is_fraud" in result
        assert "confidence" in result
        assert "risk_score" in result
        assert "explanation" in result
    
    @pytest.mark.asyncio
    async def test_predict_website_fraud_suspicious(self):
        """Test website prediction for suspicious website"""
        url = "http://free-money-guaranteed.tk"
        content = "Get rich quick! Guaranteed profit! No risk! Act now!"
        
        result = await self.prediction_service.predict_website_fraud(url, content)
        
        assert result is not None
        assert result["is_fraud"] is True
        assert result["risk_score"] > 0.5
