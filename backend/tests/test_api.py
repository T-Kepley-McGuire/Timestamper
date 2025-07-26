import base64
import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_timestamp_valid(client):
    payload = {
        "hash": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    }
    response = client.post('/api/timestamp', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert "signature" in data
    assert "timestamp" in data
    assert "exact_message" in data
    assert data["hash"] == payload["hash"]


def test_timestamp_missing_hash(client):
    response = client.post('/api/timestamp', json={})
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_timestamp_invalid_hash(client):
    payload = {"hash": "notavalidhash"}
    response = client.post('/api/timestamp', json=payload)
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_public_key(client):
    response = client.get('/api/public-key')
    assert response.status_code == 200 or response.status_code == 500
    data = response.get_json()
    if response.status_code == 200:
        assert "public_key" in data
    else:
        assert "error" in data


def test_verify_valid(client):
    # First, get a valid signature from /api/timestamp
    payload = {
        "hash": "abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd"
    }
    ts_response = client.post('/api/timestamp', json=payload)
    assert ts_response.status_code == 200
    ts_data = ts_response.get_json()
    verify_payload = {
        "message": ts_data["exact_message"],
        "signature": ts_data["signature"]
    }
    verify_response = client.post('/api/verify', json=verify_payload)
    assert verify_response.status_code == 200
    verify_data = verify_response.get_json()
    assert verify_data["valid"] is True


def test_verify_invalid_signature(client):
    payload = {
        "message": "test|1234567890.0",
        "signature": base64.b64encode(b"invalidsig").decode()
    }
    response = client.post('/api/verify', json=payload)
    assert response.status_code == 200 or response.status_code == 400
    data = response.get_json()
    assert data["valid"] is False
    assert "error" in data


def test_verify_missing_fields(client):
    response = client.post('/api/verify', json={})
    assert response.status_code == 400
    data = response.get_json()
    assert data["valid"] is False
    assert "error" in data 