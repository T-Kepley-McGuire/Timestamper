import React, { useState } from 'react';
import { API_BASE_URL } from '../api';
import OutputBox from './OutputBox';

function VerifyCard() {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setError('');
    setResult(null);
    
    if (!message.trim()) {
      setError('Message is required.');
      return;
    }
    
    if (!signature.trim()) {
      setError('Signature is required.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature })
      });
      const data = await res.json();
      
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Verification failed.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Verify Signature</h2>
      <div>
        <label htmlFor="message-input">Message</label>
        <input 
          id="message-input" 
          type="text" 
          placeholder="Enter message" 
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="signature-input">Signature</label>
        <input 
          id="signature-input" 
          type="text" 
          placeholder="Enter base64 signature" 
          value={signature}
          onChange={e => setSignature(e.target.value)}
        />
      </div>
      <button onClick={handleVerify} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify'}
      </button>
      <div style={{ marginTop: 16 }}>
        {error ? (
          <div className="error">{error}</div>
        ) : <div className="error hidden"></div>}
        {result ? (
          <div>
            <div style={{ 
              marginBottom: 12, 
              padding: '8px 12px', 
              borderRadius: 4, 
              background: result.valid ? '#d4edda' : '#f8d7da',
              color: result.valid ? '#155724' : '#721c24',
              border: `1px solid ${result.valid ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              <strong>{result.valid ? '✓ Valid Signature' : '✗ Invalid Signature'}</strong>
              {result.error && <div style={{ marginTop: 4, fontSize: 14 }}>{result.error}</div>}
            </div>
          </div>
        ) : (
          <div className="placeholder">[Verification result will appear here]</div>
        )}
      </div>
    </div>
  );
}

export default VerifyCard; 