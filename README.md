# Timestamper

A cryptographic timestamping service for proving data existence at a point in time, digital notarization, and integrity verification.

## 🎯 Purpose

Timestamper provides cryptographically secure timestamps using ECDSA signatures. It's useful for:
- **Digital notarization**: Prove when a document or data existed
- **Integrity verification**: Ensure data hasn't been tampered with
- **Audit trails**: Create verifiable timestamps for compliance
- **Blockchain alternatives**: Lightweight timestamping without blockchain complexity

## 🏗️ Project Structure

This is a monorepo containing both frontend and backend components:

```
Timestamper/
├── backend/          # Python Flask API server
│   ├── app.py       # Main Flask application
│   ├── config.py    # Configuration and private keys
│   ├── public/      # Public key files
│   └── tests/       # API tests
├── frontend/        # React single-page application
│   ├── src/         # React source code
│   │   ├── components/  # UI components
│   │   ├── App.jsx      # Main application
│   │   └── api.js       # API client
│   └── public/      # Static assets
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites
- **Backend**: Python 3.8+, pip
- **Frontend**: Node.js 16+, npm

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Timestamper
   ```

2. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Generate ECDSA key pair (if not present)
   # Add private key to config.py
   # Add public key to public/public_key.pem
   
   # Start development server
   set APP_ENV=development  # Windows
   # export APP_ENV=development  # Linux/macOS
   python app.py
   ```
   Backend runs on http://127.0.0.1:5000

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Create .env.local for development
   echo "VITE_API_BASE_URL=http://127.0.0.1:5000" > .env.local
   
   # Start development server
   npm run dev
   ```
   Frontend runs on http://localhost:5173

## 🔧 Features

### Backend API
- **Timestamp Generation**: Create cryptographically signed timestamps
- **Signature Verification**: Verify message authenticity
- **Public Key Distribution**: Serve public keys for verification
- **Multiple Environments**: Development, testing, and production modes

### Frontend Interface
- **Hash Timestamping**: Submit SHA-256 hashes for timestamping
- **File Hashing**: Generate SHA-256 hashes from uploaded files
- **Signature Verification**: Verify message-signature pairs
- **Public Key Retrieval**: Fetch and display public keys
- **Responsive Design**: Works on desktop and mobile devices

## 🔐 Security

- **ECDSA Signatures**: Uses elliptic curve cryptography for signatures
- **Private Key Protection**: Private keys stored securely in configuration
- **Public Key Verification**: Public keys available for independent verification
- **Input Validation**: Comprehensive validation of all inputs
- **Error Handling**: Secure error responses without information leakage

## 📚 API Documentation

The backend provides three main endpoints:

1. **POST /api/timestamp** - Generate timestamp and signature
2. **POST /api/verify** - Verify message and signature
3. **GET /api/public-key** - Retrieve public key

See [backend/README.md](backend/README.md) for detailed API documentation.

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Development
```bash
cd frontend
npm run lint
npm run build
```

## 🚀 Deployment

### Backend Deployment
- **Platforms**: Railway, Render, Heroku, DigitalOcean
- **Requirements**: Python 3.8+, environment variables
- **Key Management**: Secure private key storage

### Frontend Deployment
- **Platforms**: Vercel, Netlify, GitHub Pages
- **Build**: `npm run build`
- **Configuration**: Set `VITE_API_BASE_URL` to backend URL

### Full-Stack Deployment
- **Vercel**: Supports both frontend and backend
- **Docker**: Containerized deployment
- **Cloud Platforms**: AWS, GCP, Azure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

[Add your license here]

## 🆘 Support

- **Issues**: Create GitHub issues for bugs or feature requests
- **Documentation**: Check the individual README files in `backend/` and `frontend/`
- **API**: See [backend/README.md](backend/README.md) for API details

## 🔗 Related Projects

- **RFC 3161**: Time-Stamp Protocol
- **ISO/IEC 18014**: Time-stamping services
- **Blockchain Timestamping**: Alternative approaches

---

**Note**: This is a development version. For production use, ensure proper security measures, key management, and deployment configurations. 