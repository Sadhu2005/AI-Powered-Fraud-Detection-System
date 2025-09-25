"""
Ganache setup for local Ethereum blockchain testing
"""

import json
import subprocess
import time
import requests
from typing import Dict, Any

class GanacheSetup:
    def __init__(self, port: int = 8545, host: str = "127.0.0.1"):
        self.port = port
        self.host = host
        self.rpc_url = f"http://{host}:{port}"
        self.process = None
    
    def start_ganache(self, accounts: int = 10, mnemonic: str = None) -> bool:
        """Start Ganache blockchain"""
        try:
            cmd = [
                "ganache-cli",
                "--port", str(self.port),
                "--accounts", str(accounts),
                "--deterministic",
                "--gasLimit", "6721975",
                "--gasPrice", "20000000000"
            ]
            
            if mnemonic:
                cmd.extend(["--mnemonic", mnemonic])
            
            self.process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Wait for Ganache to start
            time.sleep(3)
            
            # Test connection
            if self.test_connection():
                print(f"Ganache started successfully on {self.rpc_url}")
                return True
            else:
                print("Failed to connect to Ganache")
                return False
                
        except Exception as e:
            print(f"Error starting Ganache: {e}")
            return False
    
    def test_connection(self) -> bool:
        """Test connection to Ganache"""
        try:
            response = requests.post(
                self.rpc_url,
                json={
                    "jsonrpc": "2.0",
                    "method": "eth_blockNumber",
                    "params": [],
                    "id": 1
                },
                timeout=5
            )
            return response.status_code == 200
        except:
            return False
    
    def get_accounts(self) -> list:
        """Get available accounts"""
        try:
            response = requests.post(
                self.rpc_url,
                json={
                    "jsonrpc": "2.0",
                    "method": "eth_accounts",
                    "params": [],
                    "id": 1
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get("result", [])
            return []
        except:
            return []
    
    def get_balance(self, address: str) -> int:
        """Get balance of an address"""
        try:
            response = requests.post(
                self.rpc_url,
                json={
                    "jsonrpc": "2.0",
                    "method": "eth_getBalance",
                    "params": [address, "latest"],
                    "id": 1
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return int(data.get("result", "0x0"), 16)
            return 0
        except:
            return 0
    
    def stop_ganache(self):
        """Stop Ganache process"""
        if self.process:
            self.process.terminate()
            self.process.wait()
            print("Ganache stopped")
    
    def get_network_info(self) -> Dict[str, Any]:
        """Get network information"""
        try:
            response = requests.post(
                self.rpc_url,
                json={
                    "jsonrpc": "2.0",
                    "method": "eth_blockNumber",
                    "params": [],
                    "id": 1
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                block_number = int(data.get("result", "0x0"), 16)
                
                return {
                    "rpc_url": self.rpc_url,
                    "block_number": block_number,
                    "accounts": self.get_accounts(),
                    "status": "connected"
                }
            return {"status": "disconnected"}
        except:
            return {"status": "disconnected"}

# Global Ganache instance
ganache = GanacheSetup()

def get_ganache() -> GanacheSetup:
    """Get the global Ganache instance"""
    return ganache

if __name__ == "__main__":
    # Test Ganache setup
    print("Testing Ganache setup...")
    
    if ganache.start_ganache():
        print("Ganache is running!")
        print(f"Network info: {ganache.get_network_info()}")
        print(f"Accounts: {ganache.get_accounts()}")
        
        # Keep running for testing
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            ganache.stop_ganache()
    else:
        print("Failed to start Ganache")
