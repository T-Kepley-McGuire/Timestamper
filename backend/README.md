# Timestamper Backend

A Flask-based API server for cryptographically timestamping and verifying data hashes using ECDSA signatures. Provides secure, verifiable timestamps for digital notarization and integrity verification.

## 🎯 Purpose

This backend provides cryptographically secure timestamps using ECDSA signatures. It's useful for:
- **Digital notarization**: Prove when a document or data existed
- **Integrity verification**: Ensure data hasn't been tampered with
- **Audit trails**: Create verifiable timestamps for compliance
- **Blockchain alternatives**: Lightweight timestamping without blockchain complexity

## 🏗️ Architecture

```
backend/
├── app.py              # Main Flask application
├── config.py           # Configuration and private keys
├── public/             # Public key files
│   └── public_key.pem  # PEM-encoded public key
├── tests/              # API tests
│   └── test_api.py     # Test suite
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## 🚀 Local Setup & Installation

### Prerequisites
- Python 3.8+
- pip package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Timestamper/backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Generate ECDSA key pair** (if not present)
   ```python
   # Example key generation (add to config.py)
   from cryptography.hazmat.primitives import serialization
   from cryptography.hazmat.primitives.asymmetric import ec
   
   # Generate private key
   private_key = ec.generate_private_key(ec.SECP256R1())
   
   # Get private key bytes
   private_bytes = private_key.private_bytes(
       encoding=serialization.Encoding.PEM,
       format=serialization.PrivateFormat.PKCS8,
       encryption_algorithm=serialization.NoEncryption()
   )
   
   # Get public key
   public_key = private_key.public_key()
   public_bytes = public_key.public_bytes(
       encoding=serialization.Encoding.PEM,
       format=serialization.PublicFormat.SubjectPublicKeyInfo
   )
   
   # Save to files
   with open('public/public_key.pem', 'wb') as f:
       f.write(public_bytes)
   ```

4. **Configure private key**
   - Place the private key in `config.py` as `PRIVATE_SIGNATURE_KEY`
   - Ensure `public/public_key.pem` contains the corresponding public key

## 🔧 Running the Server

### Environment Modes

- **Development:**
  ```bash
  set APP_ENV=development  # Windows
  # export APP_ENV=development  # Linux/macOS
  python app.py
  ```
  Runs on http://127.0.0.1:5000

- **Testing:**
  ```bash
  set APP_ENV=testing
  python app.py
  ```
  Runs on http://127.0.0.1:5001

- **Production:**
  ```bash
  set APP_ENV=production
  python app.py
  ```
  Runs on http://0.0.0.0:8000

### Environment Variables
- `APP_ENV`: Environment mode (development/testing/production)
- `FLASK_ENV`: Flask environment (development/production)

## 🧪 Testing

### Run Tests
```bash
pytest
```

### Test Coverage
The test suite covers:
- API endpoint functionality
- Input validation
- Error handling
- Signature generation and verification
- Public key distribution

## 🔐 Security Features

### Cryptographic Security
- **ECDSA Signatures**: Uses elliptic curve cryptography (SECP256R1)
- **Private Key Protection**: Private keys stored securely in configuration
- **Public Key Verification**: Public keys available for independent verification
- **Input Validation**: Comprehensive validation of all inputs
- **Error Handling**: Secure error responses without information leakage

### Security Best Practices
- **Input Sanitization**: All inputs are validated and sanitized
- **Rate Limiting**: Consider implementing rate limiting for production
- **CORS Configuration**: Configure CORS for frontend domain
- **HTTPS**: Use HTTPS in production environments
- **Key Management**: Secure private key storage and rotation

## 📚 API Documentation

This backend provides three main API endpoints for timestamping and verifying messages using ECDSA signatures.

---

## 1. `/api/timestamp` (POST)
**Description:**
Generates a timestamp and ECDSA signature for a given hash.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
```json
{
  "hash": "<64-character hex string>"
}
```

**Response:**
- Success (200):
```json
{
  "hash": "...",
  "timestamp": <float>,
  "exact_message": "<hash>|<timestamp>",
  "signature": "<base64 signature>"
}
```
- Error (400/500):
```json
{
  "error": "..."
}
```

**Validation:**
- Hash must be exactly 64 characters
- Hash must contain only hexadecimal characters (0-9, a-f, A-F)

---

## 2. `/api/verify` (POST)
**Description:**
Verifies a message and its ECDSA signature.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
```json
{
  "message": "<string>",
  "signature": "<base64 signature>"
}
```

**Response:**
- Success (valid):
```json
{
  "valid": true
}
```
- Failure (invalid or error):
```json
{
  "valid": false,
  "error": "..."
}
```

**Validation:**
- Message must be a non-empty string
- Signature must be a valid base64 string

---

## 3. `/api/public-key` (GET)
**Description:**
Retrieves the PEM-encoded ECDSA public key used for signature verification.

**Request:**
- Method: `GET`

**Response:**
- Success (200):
```json
{
  "public_key": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
}
```
- Error (500):
```json
{
  "error": "..."
}
```

---

**Note:** All requests and responses use JSON format. Ensure to set the `Content-Type: application/json` header for POST requests.

## 🚀 Deployment

### Production Considerations
- **WSGI Server**: Use Gunicorn or uWSGI for production
- **Reverse Proxy**: Nginx or Apache for load balancing
- **SSL/TLS**: Enable HTTPS with valid certificates
- **Environment Variables**: Secure configuration management
- **Monitoring**: Logging and health checks

### Deployment Platforms
- **Railway**: Easy deployment with automatic scaling
- **Render**: Free tier available, good for small projects
- **Heroku**: Reliable but paid service
- **DigitalOcean**: Full control, scalable
- **AWS/GCP/Azure**: Enterprise-grade cloud platforms

### Docker Deployment
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
```

## 🔧 Configuration

### Key Management
- **Private Key**: Store securely in `config.py` or environment variables
- **Public Key**: Serve from `public/public_key.pem`
- **Key Rotation**: Implement key rotation procedures for production

### CORS Configuration
For frontend integration, configure CORS:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://your-frontend-domain.com'])
```

## 📊 Performance

### Optimization Tips
- **Connection Pooling**: Use connection pooling for database operations
- **Caching**: Implement caching for frequently accessed data
- **Compression**: Enable gzip compression
- **CDN**: Use CDN for static assets

### Monitoring
- **Logging**: Structured logging for debugging
- **Metrics**: Application performance monitoring
- **Health Checks**: Endpoint for health monitoring

## 🐛 Troubleshooting

### Common Issues
1. **Key Errors**: Ensure private/public key pair is valid
2. **CORS Errors**: Configure CORS for frontend domain
3. **Port Conflicts**: Check if ports are already in use
4. **Permission Errors**: Ensure proper file permissions

### Debug Mode
For development debugging:
```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py
```

## 📚 Dependencies

### Core Dependencies
- **Flask 2.0+**: Web framework
- **cryptography 3.4+**: Cryptographic operations
- **pytest 7.0+**: Testing framework

### Optional Dependencies
- **flask-cors**: CORS support for frontend integration
- **gunicorn**: WSGI server for production
- **python-dotenv**: Environment variable management

---

For frontend integration and UI documentation, see [frontend/README.md](../frontend/README.md).
