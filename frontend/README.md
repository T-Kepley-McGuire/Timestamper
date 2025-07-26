# Timestamper Frontend

A React single-page application for interacting with the Timestamper backend API. Provides a user-friendly interface for cryptographic timestamping and verification.

## 🎯 Features

- **Hash Timestamping**: Submit SHA-256 hashes for cryptographic timestamping
- **File Hashing**: Generate SHA-256 hashes from uploaded files
- **Signature Verification**: Verify message-signature pairs
- **Public Key Retrieval**: Fetch and display public keys
- **Responsive Design**: Works on desktop and mobile devices
- **Copy Functionality**: Easy copying of hashes, signatures, and keys

## 🏗️ Project Structure

```
frontend/
├── public/              # Static assets
│   ├── index.html      # Main HTML entry point
│   └── vite.svg        # Vite logo
├── src/                # React source code
│   ├── components/     # UI components
│   │   ├── TimestampCard.jsx    # Hash timestamping interface
│   │   ├── FileHashCard.jsx     # File hashing interface
│   │   ├── VerifyCard.jsx       # Signature verification interface
│   │   ├── PublicKeyCard.jsx    # Public key retrieval interface
│   │   └── OutputBox.jsx        # Reusable output display component
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   ├── api.js          # API client configuration
│   ├── index.css       # Global styles
│   └── main.jsx        # React entry point
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## 🚀 Development Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Environment Configuration
Create a `.env.local` file for development:
```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

### Development Server
```bash
npm run dev
```
Application runs on http://localhost:5173

### Build for Production
```bash
npm run build
```
Builds to `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## 🧩 Components

### TimestampCard
- Input field for 64-character hex hashes
- Toggle for timestamp formatting (raw vs. human-readable)
- Displays timestamp, exact message, and signature
- Copy functionality for all outputs

### FileHashCard
- File upload interface
- Client-side SHA-256 hashing
- Displays generated hash with copy functionality

### VerifyCard
- Message and signature input fields
- Real-time verification with visual feedback
- Success/failure status indicators

### PublicKeyCard
- Fetches and displays public key
- Copy functionality for key distribution

### OutputBox
- Reusable component for displaying values
- Built-in copy button
- Consistent styling across all cards

## 🎨 Styling

- **CSS Variables**: Teal-based color scheme with easy customization
- **Responsive Design**: Works on all screen sizes
- **Consistent UI**: Unified design language across components
- **Hover Effects**: Interactive feedback for better UX

### Color Scheme
The application uses CSS variables for easy theming:
- Primary: Teal (`#008080`)
- Secondary: Light sea green (`#20b2aa`)
- Accent: Bright teal (`#00d4aa`)
- Status colors for success, error, warning, and info

## 🔧 Configuration

### API Configuration
The frontend connects to the backend via `src/api.js`:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### Environment Variables
- `VITE_API_BASE_URL`: Backend API endpoint URL

## 🧪 Development

### Linting
```bash
npm run lint
```

### Code Quality
- ESLint configuration for React best practices
- Consistent code formatting
- Type checking with PropTypes (if needed)

## 🚀 Deployment

### Build Process
1. Set `VITE_API_BASE_URL` to production backend URL
2. Run `npm run build`
3. Deploy `dist/` directory

### Deployment Platforms
- **Vercel**: Recommended for React apps
- **Netlify**: Easy static site deployment
- **GitHub Pages**: Free hosting for open source
- **AWS S3**: Scalable static hosting

### Environment Setup
For production deployment, set environment variables:
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

## 🔗 API Integration

The frontend integrates with the Timestamper backend API:

- **POST /api/timestamp**: Submit hashes for timestamping
- **POST /api/verify**: Verify message-signature pairs
- **GET /api/public-key**: Retrieve public keys

See [backend/README.md](../backend/README.md) for detailed API documentation.

## 🐛 Troubleshooting

### Common Issues
1. **API Connection**: Ensure backend is running and `VITE_API_BASE_URL` is correct
2. **CORS Errors**: Backend must allow frontend domain
3. **Build Errors**: Check Node.js version and dependencies

### Development Tips
- Use browser dev tools for API debugging
- Check network tab for request/response details
- Verify environment variables are loaded correctly

## 📚 Dependencies

### Core Dependencies
- **React 19.1.0**: UI framework
- **React DOM 19.1.0**: DOM rendering

### Development Dependencies
- **Vite 7.0.4**: Build tool and dev server
- **ESLint**: Code linting
- **@vitejs/plugin-react**: React support for Vite

---

For backend setup and API documentation, see [backend/README.md](../backend/README.md). 