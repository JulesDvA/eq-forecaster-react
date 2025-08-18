from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="EQ Forecaster API", version="0.1.0")

# --- CORS: allow Vite dev server ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- health check ---
@app.get("/health")
def health():
    return {"status": "ok"}

# --- types ---
class EarthquakeInput(BaseModel):
    latitude: float
    longitude: float
    depth: float
    year: int

# --- temporary stub (no ML yet) ---
@app.post("/predict")
def predict_stub(payload: EarthquakeInput):
    # Fake rule: magnitude rises a bit with depth; just so frontend can integrate
    x = np.array([payload.latitude, payload.longitude, payload.depth, payload.year], dtype=float)
    mag = float((x[2] / 100.0) + 4.5)  # e.g., ~4.5–5.5
    return {"predicted_magnitude": round(mag, 2)}
