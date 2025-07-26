import React, { useState } from 'react';

function CopyButton({ value, style, className }) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <button
      onClick={handleCopy}
      disabled={!value}
      style={{
        position: 'absolute',
        top: 6,
        right: 6,
        background: 'none',
        border: 'none',
        cursor: value ? 'pointer' : 'not-allowed',
        padding: 0,
        fontSize: 18,
        color: '#888',
        display: 'flex',
        alignItems: 'center',
        ...style
      }}
      className={className}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      tabIndex={0}
      aria-label={copied ? 'Copied!' : 'Copy'}
    >
      {/* SVG clipboard icon */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="3" width="10" height="14" rx="2" stroke="#888" strokeWidth="1.5" fill="#fff"/>
        <rect x="7" y="1" width="6" height="4" rx="1" stroke="#888" strokeWidth="1.2" fill="#fff"/>
      </svg>
      {/* Tooltip */}
      {(showTooltip || copied) && (
        <span style={{
          position: 'absolute',
          top: '-28px',
          right: 0,
          background: '#222',
          color: '#fff',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 12,
          whiteSpace: 'nowrap',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: 0.95
        }}>
          {copied ? 'Copied!' : 'Copy'}
        </span>
      )}
    </button>
  );
}

export default CopyButton; 