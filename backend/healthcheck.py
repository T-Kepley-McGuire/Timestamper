#!/usr/bin/env python3
"""
Health check script for Timestamper backend.
This script can be used by Render to verify the application is running correctly.
"""

import requests
import sys
import time

def check_health(base_url):
    """Check if the backend is healthy."""
    try:
        # Test public key endpoint
        response = requests.get(f"{base_url}/api/public-key", timeout=10)
        if response.status_code == 200:
            print("✅ Health check passed: Public key endpoint is working")
            return True
        else:
            print(f"❌ Health check failed: Public key endpoint returned {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

def main():
    """Main health check function."""
    # Get base URL from environment or use default
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:10000"
    
    print(f"🏥 Checking health of {base_url}")
    
    # Try multiple times with delays
    for attempt in range(3):
        if check_health(base_url):
            sys.exit(0)
        
        if attempt < 2:  # Don't sleep after the last attempt
            print(f"⏳ Retrying in 5 seconds... (attempt {attempt + 1}/3)")
            time.sleep(5)
    
    print("❌ Health check failed after 3 attempts")
    sys.exit(1)

if __name__ == "__main__":
    main() 