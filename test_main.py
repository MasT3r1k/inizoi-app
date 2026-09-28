from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_index():
    response = client.get("/")
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/html; charset=utf-8"

def test_search():
    search_query = "fastapi testing"
    response = client.get(f"/search?query={search_query}")
    
    assert response.status_code == 200
    
    data = response.json()
    
    assert data["search_string"] == search_query
    assert "results" in data
    assert isinstance(data["results"], list)
    
    if len(data["results"]) > 0:
        first_result = data["results"][0]
        assert "title" in first_result
        assert "link" in first_result
        assert "snippet" in first_result