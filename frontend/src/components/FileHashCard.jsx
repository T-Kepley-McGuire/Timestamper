import React, { useState } from "react";
import OutputBox from './OutputBox';

function arrayBufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function FileHashCard() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setError("");
    setHash("");
    setFile(e.target.files[0] || null);
  };

  const handleHash = async () => {
    setError("");
    setHash("");
    if (!file) {
      setError("No file selected.");
      return;
    }
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target.result;
          const digest = await window.crypto.subtle.digest(
            "SHA-256",
            arrayBuffer
          );
          setHash(arrayBufferToHex(digest));
        } catch (err) {
          setError("Hashing failed.");
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError("File reading failed.");
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError("File reading failed.");
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>SHA256 File Hash</h2>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      <button onClick={handleHash} disabled={!file || loading}>
        {loading ? "Hashing..." : "Hash File"}
      </button>
      {/* <div className="placeholder" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', minHeight: 32, marginTop: 16, position: 'relative' }}>
        {error ? (
          <div className="error">{error}</div>
        ) : <div className="error hidden"></div>}
        {hash ? (
            <OutputBox
            label="File Hash"
            value={hash || "File hash will appear here"}
          />
        ) : (
          <span>[File hash will appear here]</span>
        )}
      </div> */}
      <div style={{ marginTop: 16 }}>
        {error ? (
          <div className="error" style={{ color: "red" }}>
            {error}
          </div>
        ) : <div className="error hidden"></div>}
        {hash ? (
            <OutputBox
              label="File Hash"
              value={hash}
            />
            
        ) : (
            <div
              className="placeholder"
              style={{ minHeight: 60, marginBottom: 16 }}
            >
              [Hash will appear here]
            </div>
        )}
      </div>
    </div>
  );
}

export default FileHashCard;
