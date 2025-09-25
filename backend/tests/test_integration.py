"""
Integration tests for SafeGuard AI
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import get_db
from app.services.prediction_service import PredictionService
from app.services.blockchain_service import BlockchainService

client = TestClient(app)

class TestIntegration:
    def setup_method(self):
        self.prediction_service = PredictionService()
        self.blockchain_service = BlockchainService()
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/health/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "SafeGuard AI" in data["service"]
    
    def test_sms_prediction_flow(self):
        """Test complete SMS prediction flow"""
        # Test legitimate SMS
        response = client.post("/predict/sms", json={
            "message": "Hello, this is a normal message from your bank.",
            "sender": "BANK123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "is_fraud" in data
        assert "confidence" in data
        assert "risk_score" in data
        assert "blockchain_hash" in data
        
        # Test suspicious SMS
        response = client.post("/predict/sms", json={
            "message": "URGENT! Click here immediately to verify your account!",
            "sender": "BANK-ALERT"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["is_fraud"] is True
        assert data["risk_score"] > 0.5
    
    def test_url_prediction_flow(self):
        """Test complete URL prediction flow"""
        # Test legitimate URL
        response = client.post("/predict/url", json={
            "url": "https://www.google.com",
            "context": "Search engine"
        })
        assert response.status_code == 200
        data = response.json()
        assert "is_fraud" in data
        assert "confidence" in data
        
        # Test suspicious URL
        response = client.post("/predict/url", json={
            "url": "http://bank-security-verification.tk/verify",
            "context": "Received in SMS"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["is_fraud"] is True
    
    def test_transaction_prediction_flow(self):
        """Test complete transaction prediction flow"""
        response = client.post("/predict/transaction", json={
            "amount": 1000.0,
            "merchant": "Amazon",
            "location": "Mumbai",
            "user_id": "user123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "is_fraud" in data
        assert "confidence" in data
        assert "risk_score" in data
    
    def test_website_prediction_flow(self):
        """Test complete website prediction flow"""
        response = client.post("/predict/website", json={
            "url": "https://www.amazon.com",
            "content": "Welcome to Amazon - Your trusted online shopping destination",
            "metadata": {
                "ssl_certificate": True,
                "domain_age_days": 365
            }
        })
        assert response.status_code == 200
        data = response.json()
        assert "is_fraud" in data
        assert "confidence" in data
    
    def test_blockchain_verification(self):
        """Test blockchain verification flow"""
        # First make a prediction to get a hash
        response = client.post("/predict/sms", json={
            "message": "Test message for blockchain verification",
            "sender": "TEST123"
        })
        assert response.status_code == 200
        data = response.json()
        blockchain_hash = data["blockchain_hash"]
        
        # Verify the prediction
        response = client.post("/blockchain/verify", json={
            "hash": blockchain_hash
        })
        assert response.status_code == 200
        data = response.json()
        assert "found" in data
    
    def test_fraud_reporting(self):
        """Test fraud reporting flow"""
        response = client.post("/blockchain/report", json={
            "fraud_type": "phishing",
            "description": "Test fraud report for integration testing",
            "evidence": {
                "url": "http://test-phishing.com",
                "message": "Test phishing message"
            },
            "reporter_id": "test_user"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "hash" in data
        assert "block_number" in data
    
    def test_blockchain_stats(self):
        """Test blockchain statistics endpoint"""
        response = client.get("/blockchain/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_blocks" in data
        assert "total_transactions" in data
        assert "fraud_reports" in data
        assert "predictions" in data
    
    def test_fraud_registry(self):
        """Test fraud registry endpoint"""
        response = client.get("/blockchain/registry")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_network_status(self):
        """Test blockchain network status"""
        response = client.get("/blockchain/status")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "chain_length" in data
        assert "pending_transactions" in data
    
    @pytest.mark.asyncio
    async def test_prediction_service_integration(self):
        """Test prediction service integration"""
        # Test SMS prediction
        result = await self.prediction_service.predict_sms_fraud(
            "Test message", "TEST123"
        )
        assert result is not None
        assert "is_fraud" in result
        
        # Test URL prediction
        result = await self.prediction_service.predict_url_fraud(
            "https://example.com"
        )
        assert result is not None
        assert "is_fraud" in result
    
    @pytest.mark.asyncio
    async def test_blockchain_service_integration(self):
        """Test blockchain service integration"""
        # Test logging prediction
        hash_value = await self.blockchain_service.log_prediction({
            "type": "test",
            "data": "test data"
        })
        assert hash_value is not None
        
        # Test verification
        result = await self.blockchain_service.verify_prediction(hash_value)
        assert result is not None
        assert "found" in result
    
    def test_error_handling(self):
        """Test error handling"""
        # Test invalid SMS prediction
        response = client.post("/predict/sms", json={
            "message": ""  # Empty message
        })
        assert response.status_code == 200  # Should handle gracefully
        
        # Test invalid URL prediction
        response = client.post("/predict/url", json={
            "url": ""  # Empty URL
        })
        assert response.status_code == 200  # Should handle gracefully
    
    def test_cors_headers(self):
        """Test CORS headers"""
        response = client.options("/predict/sms")
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
    
    def test_api_documentation(self):
        """Test API documentation endpoints"""
        response = client.get("/docs")
        assert response.status_code == 200
        
        response = client.get("/redoc")
        assert response.status_code == 200
