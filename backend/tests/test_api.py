import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root_status():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "Stock Research Agent running"}

def test_get_quote():
    response = client.get("/api/stock/NVDA/quote")
    assert response.status_code == 200
    data = response.json()
    assert data["ticker"] == "NVDA"
    assert "price" in data

def test_in_filing_search():
    payload = {"query": "GPU", "ticker": "NVDA", "form_type": "10-K"}
    response = client.post("/api/filings/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["ticker"] == "NVDA"
    assert "matches" in data
