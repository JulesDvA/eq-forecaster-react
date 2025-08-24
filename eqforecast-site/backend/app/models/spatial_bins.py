from enum import Enum
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class BinRiskLevel(str, Enum):
    """Risk level enumeration for spatial bins"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class SpatialBin(BaseModel):
    """Model for a spatial earthquake prediction bin"""
    id: int
    name: str
    region_code: str
    coordinates: List[List[float]]  # [[lat, lon], [lat, lon], ...] for polygon
    center_lat: float
    center_lon: float
    risk_level: BinRiskLevel
    risk_score: float
    historical_earthquake_count: int
    avg_magnitude: float
    max_magnitude: float
    color: str
    description: Optional[str] = None


class BinCollection(BaseModel):
    """Collection of spatial bins with metadata"""
    bins: List[SpatialBin]
    total_area_km2: float
    coverage_description: str
    created_date: datetime
    last_updated: datetime
