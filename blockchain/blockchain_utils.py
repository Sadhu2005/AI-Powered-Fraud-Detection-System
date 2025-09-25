"""
Blockchain utilities for SafeGuard AI fraud registry
"""

import json
import hashlib
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
import os

class SafeGuardBlockchain:
    def __init__(self, ledger_file: str = "ledger.json"):
        self.ledger_file = ledger_file
        self.chain = []
        self.pending_transactions = []
        self.difficulty = 4
        self.mining_reward = 0
        self._load_ledger()
    
    def _load_ledger(self):
        """Load blockchain from file"""
        try:
            if os.path.exists(self.ledger_file):
                with open(self.ledger_file, 'r') as f:
                    data = json.load(f)
                    self.chain = data.get('chain', [])
                    self.pending_transactions = data.get('pending_transactions', [])
            else:
                self._create_genesis_block()
        except Exception as e:
            print(f"Error loading ledger: {e}")
            self._create_genesis_block()
    
    def _save_ledger(self):
        """Save blockchain to file"""
        try:
            data = {
                "chain": self.chain,
                "pending_transactions": self.pending_transactions,
                "network_info": {
                    "name": "SafeGuard AI Fraud Registry",
                    "version": "1.0.0",
                    "genesis_timestamp": self.chain[0]["timestamp"] if self.chain else None,
                    "difficulty": self.difficulty,
                    "mining_reward": self.mining_reward
                },
                "stats": self.get_stats()
            }
            with open(self.ledger_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving ledger: {e}")
    
    def _create_genesis_block(self):
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
        self._save_ledger()
    
    def _calculate_hash(self, index: int, transactions: List, previous_hash: str, nonce: int) -> str:
        """Calculate SHA-256 hash of a block"""
        block_string = f"{index}{json.dumps(transactions, sort_keys=True)}{previous_hash}{nonce}"
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def _proof_of_work(self, index: int, transactions: List, previous_hash: str) -> int:
        """Simple proof of work algorithm"""
        nonce = 0
        target = "0" * self.difficulty
        
        while True:
            hash_result = self._calculate_hash(index, transactions, previous_hash, nonce)
            if hash_result.startswith(target):
                return nonce
            nonce += 1
    
    def add_transaction(self, transaction: Dict[str, Any]) -> str:
        """Add a transaction to pending transactions"""
        transaction_id = hashlib.sha256(
            f"{json.dumps(transaction, sort_keys=True)}{time.time()}".encode()
        ).hexdigest()[:16]
        
        transaction["id"] = transaction_id
        transaction["timestamp"] = datetime.now().isoformat()
        
        self.pending_transactions.append(transaction)
        self._save_ledger()
        
        return transaction_id
    
    def mine_block(self) -> Dict[str, Any]:
        """Mine a new block with pending transactions"""
        if not self.pending_transactions:
            return {"error": "No pending transactions"}
        
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
        self._save_ledger()
        
        return {
            "success": True,
            "block": new_block,
            "transactions_count": len(transactions)
        }
    
    def verify_chain(self) -> bool:
        """Verify the integrity of the blockchain"""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            
            # Check if current block's previous hash matches previous block's hash
            if current_block["previous_hash"] != previous_block["hash"]:
                return False
            
            # Check if current block's hash is valid
            calculated_hash = self._calculate_hash(
                current_block["index"],
                current_block["transactions"],
                current_block["previous_hash"],
                current_block["nonce"]
            )
            
            if current_block["hash"] != calculated_hash:
                return False
        
        return True
    
    def get_transaction(self, transaction_id: str) -> Optional[Dict[str, Any]]:
        """Get a transaction by ID"""
        for block in self.chain:
            for transaction in block["transactions"]:
                if transaction.get("id") == transaction_id:
                    return transaction
        return None
    
    def get_fraud_reports(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Get fraud reports from blockchain"""
        fraud_reports = []
        for block in self.chain:
            for transaction in block["transactions"]:
                if transaction.get("type") == "fraud_report":
                    fraud_reports.append({
                        "id": transaction["id"],
                        "fraud_type": transaction.get("fraud_type"),
                        "description": transaction.get("description"),
                        "timestamp": transaction["timestamp"],
                        "block_index": block["index"]
                    })
        
        return fraud_reports[offset:offset + limit]
    
    def get_predictions(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Get predictions from blockchain"""
        predictions = []
        for block in self.chain:
            for transaction in block["transactions"]:
                if transaction.get("type") == "prediction":
                    predictions.append({
                        "id": transaction["id"],
                        "prediction_type": transaction.get("data", {}).get("type"),
                        "is_fraud": transaction.get("data", {}).get("prediction", {}).get("is_fraud"),
                        "confidence": transaction.get("data", {}).get("prediction", {}).get("confidence"),
                        "timestamp": transaction["timestamp"],
                        "block_index": block["index"]
                    })
        
        return predictions[offset:offset + limit]
    
    def get_stats(self) -> Dict[str, Any]:
        """Get blockchain statistics"""
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
            "chain_integrity": "verified" if self.verify_chain() else "compromised"
        }
    
    def get_network_status(self) -> Dict[str, Any]:
        """Get network status"""
        return {
            "status": "active",
            "chain_length": len(self.chain),
            "pending_transactions": len(self.pending_transactions),
            "last_block_hash": self.chain[-1]["hash"] if self.chain else None,
            "network_health": "healthy",
            "integrity_verified": self.verify_chain()
        }

# Global blockchain instance
blockchain = SafeGuardBlockchain()

def get_blockchain() -> SafeGuardBlockchain:
    """Get the global blockchain instance"""
    return blockchain
