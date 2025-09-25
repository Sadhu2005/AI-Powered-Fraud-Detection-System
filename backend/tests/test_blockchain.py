"""
Tests for blockchain service
"""

import pytest
from unittest.mock import Mock, patch
from app.services.blockchain_service import BlockchainService

class TestBlockchainService:
    def setup_method(self):
        self.blockchain_service = BlockchainService()
    
    @pytest.mark.asyncio
    async def test_log_prediction(self):
        """Test logging a prediction to blockchain"""
        prediction_data = {
            "type": "sms",
            "message": "Test message",
            "prediction": {"is_fraud": False, "confidence": 0.8}
        }
        
        result = await self.blockchain_service.log_prediction(prediction_data)
        
        assert result is not None
        assert isinstance(result, str)
        assert len(result) > 0
    
    @pytest.mark.asyncio
    async def test_report_fraud(self):
        """Test reporting fraud to blockchain"""
        fraud_data = {
            "fraud_type": "phishing",
            "description": "Test fraud report",
            "evidence": {"url": "http://test.com"},
            "reporter_id": "user123"
        }
        
        result = await self.blockchain_service.report_fraud(
            fraud_data["fraud_type"],
            fraud_data["description"],
            fraud_data["evidence"],
            fraud_data["reporter_id"]
        )
        
        assert result is not None
        assert "hash" in result
        assert "block_number" in result
        assert isinstance(result["hash"], str)
        assert isinstance(result["block_number"], int)
    
    @pytest.mark.asyncio
    async def test_verify_prediction(self):
        """Test verifying a prediction's blockchain integrity"""
        # First log a prediction
        prediction_data = {
            "type": "sms",
            "message": "Test message",
            "prediction": {"is_fraud": False, "confidence": 0.8}
        }
        
        hash_value = await self.blockchain_service.log_prediction(prediction_data)
        
        # Then verify it
        result = await self.blockchain_service.verify_prediction(hash_value)
        
        assert result is not None
        assert "found" in result
        assert result["found"] is True
        assert "block_index" in result
        assert "transaction" in result
    
    @pytest.mark.asyncio
    async def test_get_network_status(self):
        """Test getting blockchain network status"""
        result = await self.blockchain_service.get_network_status()
        
        assert result is not None
        assert "status" in result
        assert "chain_length" in result
        assert "pending_transactions" in result
        assert result["status"] == "active"
        assert isinstance(result["chain_length"], int)
        assert isinstance(result["pending_transactions"], int)
    
    @pytest.mark.asyncio
    async def test_get_fraud_registry(self):
        """Test getting fraud registry entries"""
        # First report some fraud
        await self.blockchain_service.report_fraud(
            "phishing",
            "Test phishing report",
            {"url": "http://test.com"},
            "user123"
        )
        
        result = await self.blockchain_service.get_fraud_registry()
        
        assert result is not None
        assert isinstance(result, list)
        # Should have at least one fraud report
        assert len(result) >= 1
        assert "fraud_type" in result[0]
        assert "description" in result[0]
    
    @pytest.mark.asyncio
    async def test_get_blockchain_stats(self):
        """Test getting blockchain statistics"""
        result = await self.blockchain_service.get_blockchain_stats()
        
        assert result is not None
        assert "total_blocks" in result
        assert "total_transactions" in result
        assert "fraud_reports" in result
        assert "predictions" in result
        assert isinstance(result["total_blocks"], int)
        assert isinstance(result["total_transactions"], int)
        assert isinstance(result["fraud_reports"], int)
        assert isinstance(result["predictions"], int)
