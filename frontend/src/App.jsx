import React from 'react';
import './App.css';
import TimestampCard from './components/TimestampCard';
import VerifyCard from './components/VerifyCard';
import PublicKeyCard from './components/PublicKeyCard';
import FileHashCard from './components/FileHashCard';

function App() {
  return (
    <div className="app-container">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Timestamper Demo</h1>
      <div className="cards-layout">
        <FileHashCard />
        <TimestampCard />
        <VerifyCard />
        <PublicKeyCard />
      </div>
    </div>
  );
}

export default App; 