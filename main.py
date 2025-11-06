from datetime import datetime
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import worker

app = FastAPI()

# Serve /static/* from the ./static folder
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve the page 
@app.get("/")
def root():
    return FileResponse("static/index.html")

# Get a coin 
@app.get("/coin/{uid}")
def ping():
    return {"status": "in-progress", "front": "front text", "back": "back test", "uid": "the uid"}

# Simple JSON endpoint (POST)
class CoinIn(BaseModel):
    text: str

# Create a coin
@app.post("/coin")
def echo(body: CoinIn):
    assert len(body.text) < 320
    ret = worker.compute_coin(body.text)
    print(ret.json())
    return ret.json()

