import React, { useState } from "react";
import { API_BASE_URL } from "../api";
import OutputBox from "./OutputBox";

function PublicKeyCard() {
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setError("");
    setPublicKey("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/public-key`);
      const data = await res.json();
      if (res.ok && data.public_key) {
        setPublicKey(data.public_key);
      } else {
        setError(data.error || "Failed to fetch public key.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Get Public Key</h2>
      <button
        onClick={handleFetch}
        style={{ marginBottom: 16 }}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Public Key"}
      </button>
      {error ? (
        <div
          className="placeholder"
          style={{ color: "red", minHeight: 60, marginBottom: 16 }}
        >
          {error}
        </div>
      ) : publicKey ? (
        <OutputBox label="Public Key" value={publicKey} minHeight={60} />
      ) : (
        <div className="placeholder" style={{ minHeight: 60 }}>
          [Public key will appear here]
        </div>
      )}
    </div>
  );
}

export default PublicKeyCard;
