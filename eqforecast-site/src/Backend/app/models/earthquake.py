"""
Pydantic models for earthquake data
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, validator


class EarthquakeBase(BaseModel):
    """Base earthquake model"""
    timestamp: datetime
    latitude: float = Field(..., ge=-90, le=90, description="Latitude in decimal degrees")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude in decimal degrees")
    depth: float = Field(..., ge=0, description="Depth in kilometers")
    magnitude: float = Field(..., ge=0, le=10, description="Earthquake magnitude")
    region: str = Field(..., description="Philippine region code")
    location_description: Optional[str] = Field(None, description="Human-readable location")
    source: str = Field(default="PHIVOLCS", description="Data source")


class EarthquakeCreate(EarthquakeBase):
    """Model for creating new earthquake records"""
    pass


class EarthquakeResponse(EarthquakeBase):
    """Model for earthquake API responses"""
    id: str = Field(..., description="Unique earthquake identifier")
    
    class Config:
        from_attributes = True


class EarthquakeFilter(BaseModel):
    """Model for filtering earthquake data"""
    region: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_magnitude: Optional[float] = Field(None, ge=0, le=10)
    max_magnitude: Optional[float] = Field(None, ge=0, le=10)
    min_depth: Optional[float] = Field(None, ge=0)
    max_depth: Optional[float] = Field(None, ge=0)
    limit: int = Field(100, ge=1, le=1000)
    
    @validator('max_magnitude')
    def validate_magnitude_range(cls, v, values):
        if v is not None and 'min_magnitude' in values and values['min_magnitude'] is not None:
            if v < values['min_magnitude']:
                raise ValueError('max_magnitude must be greater than min_magnitude')
        return v


class RegionInfo(BaseModel):
    """Model for Philippine region information"""
    name: str
    code: str
    earthquake_count: int
    last_earthquake: Optional[datetime] = None
    avg_magnitude: float


class EarthquakeStatistics(BaseModel):
    """Model for earthquake statistics"""
    region: Optional[str] = None
    total_earthquakes: int
    magnitude_stats: dict
    depth_stats: dict
    data_source: str
    last_updated: datetime


class PredictionRequest(BaseModel):
    """Model for earthquake prediction requests"""
    region: str
    prediction_days: int = Field(default=30, ge=1, le=365, description="Number of days to predict")
    include_confidence: bool = Field(default=True, description="Include confidence intervals")


class PredictionResponse(BaseModel):
    """Model for earthquake prediction responses"""
    region: str
    prediction_date: datetime
    predicted_magnitude: float
    confidence_interval: Optional[dict] = None
    probability_score: float = Field(..., ge=0, le=1)
    model_version: str
    prediction_timestamp: datetime
