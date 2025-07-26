#!/usr/bin/env python3
"""
Deployment script for Timestamper backend.
This script helps generate and manage cryptographic keys for production deployment.
"""

import os
import sys
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.backends import default_backend

def generate_key_pair():
    """Generate a new ECDSA key pair for production."""
    print("🔐 Generating new ECDSA key pair...")
    
    # Generate private key
    private_key = ec.generate_private_key(ec.SECP256R1(), default_backend())
    
    # Get private key in PEM format
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    
    # Get public key in PEM format
    public_key = private_key.public_key()
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    return private_pem.decode(), public_pem.decode()

def save_public_key(public_key_pem):
    """Save public key to file."""
    try:
        os.makedirs("public", exist_ok=True)
        with open("public/public_key.pem", "w") as f:
            f.write(public_key_pem)
        print("✅ Public key saved to public/public_key.pem")
    except Exception as e:
        print(f"❌ Error saving public key: {e}")
        return False
    return True

def main():
    """Main deployment function."""
    print("🚀 Timestamper Backend Deployment Script")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("app.py"):
        print("❌ Error: app.py not found. Run this script from the backend directory.")
        sys.exit(1)
    
    # Generate new key pair
    private_key_pem, public_key_pem = generate_key_pair()
    
    # Save public key
    if not save_public_key(public_key_pem):
        sys.exit(1)
    
    print("\n📋 Deployment Instructions:")
    print("=" * 50)
    print("1. Add the following environment variable to your Render service:")
    print("   PRIVATE_SIGNATURE_KEY")
    print("   Value:")
    print(f"   {private_key_pem}")
    print("\n2. The public key has been saved to public/public_key.pem")
    print("3. Commit and push the public key file to your repository")
    print("4. Deploy your service on Render")
    
    print("\n⚠️  Security Notes:")
    print("- Keep the private key secure and never commit it to version control")
    print("- The private key is already in your .gitignore")
    print("- Use environment variables for production deployment")

if __name__ == "__main__":
    main() 