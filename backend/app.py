from flask import Flask, request, jsonify
import time
import base64
import os

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


from config import PRIVATE_SIGNATURE_KEY


app = Flask(__name__)

# Configure CORS with specific origins and security settings
CORS(app, 
     origins=[
         "http://localhost:5173",  # Vite dev server
         "http://127.0.0.1:5173",  # Vite dev server alternative
         "http://localhost:3000",  # Alternative dev port
         "http://127.0.0.1:3000",  # Alternative dev port
         # Render domains
         "https://timestamper-backend.onrender.com",
         # Add your production frontend URL here
         # "https://your-frontend-domain.com"
     ],
     methods=["GET", "POST"],
     allow_headers=["Content-Type"],
     supports_credentials=False)

# Configure rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Rate limit specific endpoints
@app.route("/api/timestamp", methods=['POST'])
@limiter.limit("10 per minute")  # More restrictive for timestamp endpoint
def timestamp():
    data = request.get_json(silent=True)
    if not data or "hash" not in data:
        return jsonify({"error": "JSON body must include 'hash' field"}), 400
    h = data["hash"]
    try:
        # optional: validate hash is hex and correct length
        if len(h) != 64 or not all(c in "0123456789abcdefABCDEF" for c in h):
            return jsonify({"error": "hash must be a 64-character hex string"}), 400

        t = time.time()
        exactMessage = f"{h}|{t}".encode("utf-8")

        signature = PRIVATE_SIGNATURE_KEY.sign(
            exactMessage,
            ec.ECDSA(hashes.SHA256())
        )

        b64sig = base64.b64encode(signature).decode()

        return jsonify({
            "hash": h,
            "timestamp": t,
            "exact_message": exactMessage.decode(),
            "signature": b64sig
        })
    except Exception as e:
        print(f"Error in /api/timestamp: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/api/public-key", methods=['GET'])
@limiter.limit("100 per minute")  # Less restrictive for public key
def getPublicKey():
    try:
        with open("public/public_key.pem", "rb") as key_file:
            public_key = key_file.read().decode()
        return {"public_key": str(public_key)}
    except FileNotFoundError as fnf_error:
        print(f"Public key file not found: {fnf_error}")
        return jsonify({"error": "An error occurred while retrieving the public key."}), 500
    except UnicodeDecodeError as decode_error:
        print(f"Public key could not be decoded: {decode_error}")
        return jsonify({"error": "An error occurred while retrieving the public key."}), 500
    except Exception as e:
        print(f"Unexpected error retrieving public key: {e}")
        return jsonify({"error": "An error occurred while retrieving the public key."}), 500

@app.route("/api/verify", methods=['POST'])
@limiter.limit("20 per minute")  # Moderate rate limit for verification
def verify():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"valid": False, "error": "JSON body required"}), 400
    m = data.get("message")
    s = data.get("signature")
    if not m:
        return jsonify({"valid": False, "error": "'message' field is required"}), 400
    if not s:
        return jsonify({"valid": False, "error": "'signature' field is required"}), 400
    try:
        with open("public/public_key.pem", "rb") as key_file:
            public_key = serialization.load_pem_public_key(key_file.read())
        try:
            signature_bytes = base64.b64decode(s)
        except Exception as decode_error:
            print(f"Signature base64 decode error: {decode_error}")
            return jsonify({"valid": False, "error": "Signature must be base64-encoded"}), 400
        try:
            public_key.verify(signature_bytes, m.encode(), ec.ECDSA(hashes.SHA256()))
            return jsonify({"valid": True})
        except Exception as verify_error:
            print(f"Signature verification failed: {verify_error}")
            return jsonify({"valid": False, "error": "Signature verification failed"}), 200
    except Exception as e:
        print(f"Error in /api/verify: {e}")
        return jsonify({"valid": False, "error": "Internal server error"}), 500


# Error handler for rate limiting
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({
        "error": "Rate limit exceeded. Please try again later.",
        "retry_after": e.retry_after
    }), 429


if __name__ == "__main__":
    import os
    env = os.environ.get("APP_ENV", "development").lower()
    if env == "production":
        # Production: no debug, listen on all interfaces, port 8000
        app.run(host="0.0.0.0", port=8000, debug=False)
    elif env == "testing":
        # Testing: debug on, listen on localhost, port 5001
        app.run(host="127.0.0.1", port=5001, debug=True)
    else:
        # Development (default): debug on, listen on localhost, port 5000
        app.run(host="127.0.0.1", port=5000, debug=True)