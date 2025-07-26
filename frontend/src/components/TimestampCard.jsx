import React, { useState } from "react";
import { API_BASE_URL } from "../api";
import OutputBox from "./OutputBox";

function TimestampCard() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formatTimestamp, setFormatTimestamp] = useState(false);

  const isValidHash = (h) => h.length === 64 && /^[0-9a-fA-F]+$/.test(h);

  const formatTimestampValue = (timestamp) => {
    if (!timestamp) return "Timestamp will appear here";
    if (!formatTimestamp) return timestamp;

    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    } catch (err) {
      return timestamp;
    }
  };

  const handleTimestamp = async () => {
    setError("");
    setResult(null);
    if (!isValidHash(hash)) {
      setError("Hash must be a 64-character hex string.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/timestamp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash }),
      });
      const data = await res.json();
      if (res.ok && data.signature) {
        setResult(data);
      } else {
        setError(data.error || "Failed to get timestamp.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const formatTimestampButton = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "4px",
        marginTop: "4px",
      }}
    >
      <label style={{ fontSize: "14px", fontWeight: "500" }}>
        Format timestamp:
      </label>
      <button
        type="button"
        onClick={() => setFormatTimestamp(!formatTimestamp)}
        style={{
          padding: "4px 8px",
          fontSize: "12px",
          background: formatTimestamp ? "var(--primary)" : "var(--gray)",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        {formatTimestamp ? "ON" : "OFF"}
      </button>
    </div>
  );

  return (
    <div className="card">
      <h2>Timestamp a Hash</h2>
      <div>
        <label htmlFor="hash-input">Hash</label>
        <input
          id="hash-input"
          type="text"
          placeholder="Enter 64-char hex hash"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
        />
      </div>
      <button onClick={handleTimestamp} disabled={loading}>
        {loading ? "Requesting..." : "Get Timestamp & Signature"}
      </button>
      <div style={{ marginTop: 16 }}>
        {error ? (
          <div className="error" style={{ color: "red" }}>
            {error}
          </div>
        ) : (
          <div className="error hidden"></div>
        )}
        {result ? (
          <>
            {formatTimestampButton}
            <OutputBox
              label="Timestamp"
              value={formatTimestampValue(result?.timestamp)}
            />
            <OutputBox
              label="Exact Message"
              value={result?.exact_message || "Exact message will appear here"}
            />
            <OutputBox
              label="Signature"
              value={result?.signature || "Signature will appear here"}
            />
          </>
        ) : (
          <>
            {formatTimestampButton}
            <div
              className="placeholder"
              style={{ minHeight: 60, marginBottom: 16 }}
            >
              [Timestamp will appear here]
            </div>
            <div
              className="placeholder"
              style={{ minHeight: 60, marginBottom: 16 }}
            >
              [Exact message will appear here]
            </div>
            <div
              className="placeholder"
              style={{ minHeight: 60, marginBottom: 16 }}
            >
              [Signature will appear here]
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TimestampCard;
