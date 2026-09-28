from fastapi import FastAPI
from fastapi.responses import FileResponse
from ddgs import DDGS
import os

from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/public", StaticFiles(directory="public"), name="public")

@app.get("/")
def read_root():
    file_path = os.path.join(os.path.dirname(__file__), "index.html")
    return FileResponse(file_path)

@app.get("/search")
def duckduckgo_search(query: str):
    results = []
    with DDGS() as ddgs:
        for item in list(ddgs.text(query, max_results=10)):
            results.append({
                "title": item.get("title"),
                "link": item.get("href"),
                "snippet": item.get("body")
            })
    return {
        "search_string": query,
        "results": results
    }