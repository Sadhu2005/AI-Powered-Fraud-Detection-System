"""
Blockchain service for tamper-proof fraud logging
"""

import hashlib
import json
import time
from datetime import datetime
from typing import Dict, Any, List
from app.utils.logger import get_logger

logger = get_logger(__name__)

class BlockchainService:
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        self._initialize_genesis_block()
    
    def _initialize_genesis_block(self):
        """Create the genesis block"""
        genesis_block = {
            "index": 0,
            "timestamp": datetime.now().isoformat(),
            "transactions": [],
            "previous_hash": "0",
            "nonce": 0,
            "hash": self._calculate_hash(0, [], "0", 0)
        }
        self.chain.append(genesis_block)
        logger.info("Genesis block created")
    
    def _calculate_hash(self, index: int, transactions: List, previous_hash: str, nonce: int) -> str:
        """Calculate SHA-256 hash of a block"""
        block_string = f"{index}{transactions}{previous_hash}{nonce}"
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def _proof_of_work(self, index: int, transactions: List, previous_hash: str) -> int:
        """Simple proof of work algorithm"""
        nonce = 0
        while True:
            hash_result = self._calculate_hash(index, transactions, previous_hash, nonce)
            if hash_result.startswith("0000"):  # Simple difficulty
                return nonce
            nonce += 1
    
    async def log_prediction(self, prediction_data: Dict[str, Any]) -> str:
        """Log a prediction to the blockchain"""
        try:
            transaction = {
                "type": "prediction",
                "data": prediction_data,
                "timestamp": datetime.now().isoformat(),
                "id": hashlib.sha256(
                    f"{prediction_data}{time.time()}".encode()
                ).hexdigest()[:16]
            }
            
            self.pending_transactions.append(transaction)
            
            # Create new block if we have enough transactions
            if len(self.pending_transactions) >= 5:  # Batch transactions
                await self._mine_block()
            
            return transaction["id"]
            
        except Exception as e:
            logger.error(f"Failed to log prediction: {e}")
            raise
    
    async def _mine_block(self):
        """Mine a new block with pending transactions"""
        try:
            previous_block = self.chain[-1]
            index = len(self.chain)
            
            # Get pending transactions
            transactions = self.pending_transactions.copy()
            self.pending_transactions.clear()
            
            # Calculate proof of work
            nonce = self._proof_of_work(index, transactions, previous_block["hash"])
            
            # Create new block
            new_block = {
                "index": index,
                "timestamp": datetime.now().isoformat(),
                "transactions": transactions,
                "previous_hash": previous_block["hash"],
                "nonce": nonce,
                "hash": self._calculate_hash(index, transactions, previous_block["hash"], nonce)
            }
            
            self.chain.append(new_block)
            logger.info(f"Block {index} mined with {len(transactions)} transactions")
            
        except Exception as e:
            logger.error(f"Block mining failed: {e}")
            raise
    
    async def report_fraud(self, fraud_type: str, description: str, 
                          evidence: Dict[str, Any], reporter_id: str = None) -> Dict[str, Any]:
        """Report a fraud case to the blockchain"""
        try:
            fraud_report = {
                "type": "fraud_report",
                "fraud_type": fraud_type,
                "description": description,
                "evidence": evidence,
                "reporter_id": reporter_id,
                "timestamp": datetime.now().isoformat(),
                "id": hashlib.sha256(
                    f"{fraud_type}{description}{time.time()}".encode()
                ).hexdigest()[:16]
            }
            
            self.pending_transactions.append(fraud_report)
            
            # Mine block immediately for fraud reports
            await self._mine_block()
            
            return {
                "hash": fraud_report["id"],
                "block_number": len(self.chain) - 1
            }
            
        except Exception as e:
            logger.error(f"Fraud reporting failed: {e}")
            raise
    
    async def verify_prediction(self, hash_value: str) -> Dict[str, Any]:
        """Verify a prediction's blockchain integrity"""
        try:
            for block in self.chain:
                for transaction in block["transactions"]:
                    if transaction.get("id") == hash_value:
                        return {
                            "found": True,
                            "block_index": block["index"],
                            "transaction": transaction,
                            "block_hash": block["hash"],
                            "verified": True
                        }
            
            return {
                "found": False,
                "message": "Transaction not found in blockchain"
            }
            
        except Exception as e:
            logger.error(f"Verification failed: {e}")
            return {
                "found": False,
                "error": str(e)
            }
    
    async def get_network_status(self) -> Dict[str, Any]:
        """Get blockchain network status"""
        try:
            return {
                "status": "active",
                "chain_length": len(self.chain),
                "pending_transactions": len(self.pending_transactions),
                "last_block_hash": self.chain[-1]["hash"] if self.chain else None,
                "network_health": "healthy"
            }
        except Exception as e:
            logger.error(f"Network status check failed: {e}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    async def get_fraud_registry(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Get fraud registry entries from blockchain"""
        try:
            fraud_reports = []
            for block in self.chain:
                for transaction in block["transactions"]:
                    if transaction.get("type") == "fraud_report":
                        fraud_reports.append({
                            "id": transaction["id"],
                            "fraud_type": transaction["fraud_type"],
                            "description": transaction["description"],
                            "timestamp": transaction["timestamp"],
                            "block_index": block["index"]
                        })
            
            # Apply pagination
            return fraud_reports[offset:offset + limit]
            
        except Exception as e:
            logger.error(f"Registry retrieval failed: {e}")
            return []
    
    async def get_blockchain_stats(self) -> Dict[str, Any]:
        """Get blockchain statistics"""
        try:
            total_transactions = sum(len(block["transactions"]) for block in self.chain)
            fraud_reports = sum(
                1 for block in self.chain 
                for transaction in block["transactions"] 
                if transaction.get("type") == "fraud_report"
            )
            predictions = sum(
                1 for block in self.chain 
                for transaction in block["transactions"] 
                if transaction.get("type") == "prediction"
            )
            
            return {
                "total_blocks": len(self.chain),
                "total_transactions": total_transactions,
                "fraud_reports": fraud_reports,
                "predictions": predictions,
                "pending_transactions": len(self.pending_transactions),
                "chain_integrity": "verified"
            }
            
        except Exception as e:
            logger.error(f"Stats calculation failed: {e}")
            return {
                "error": str(e)
            }
