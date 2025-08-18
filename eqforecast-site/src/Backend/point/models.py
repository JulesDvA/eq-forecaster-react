from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ForecastRequest(BaseModel):
    year: int
    bins: Optional[List[int]] = None

class EarthquakeData(BaseModel):
    bin_id: int
    max_magnitude: float
    num_earthquakes: int
    confidence: float

class ForecastResponse(BaseModel):
    year: int
    forecast_date: datetime
    predictions: List[EarthquakeData]
    model_version: str

class BinInfo(BaseModel):
    bin_id: int
    name: str
    risk_level: str
    coordinates: List[List[float]]  # Polygon coordinates
    historical_data: Optional[dict] = None