from fastapi import APIRouter, HTTPException
from app.models import ForecastRequest, ForecastResponse, EarthquakeData
from app.services.ml_service import MLService
from datetime import datetime

router = APIRouter(prefix="/forecast", tags=["forecast"])
ml_service = MLService()

@router.post("/{year}", response_model=ForecastResponse)
async def generate_forecast(year: int, request: ForecastRequest = None):
    """Generate earthquake forecast for specified year and BINs"""
    try:
        # Validate year
        if year < 2024 or year > 2030:
            raise HTTPException(status_code=400, detail="Year must be between 2024-2030")
        
        # Use ML service to generate predictions
        predictions = await ml_service.predict_earthquakes(year, request.bins if request else None)
        
        return ForecastResponse(
            year=year,
            forecast_date=datetime.now(),
            predictions=predictions,
            model_version="LSTM-v1.0"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bins/{bin_id}/historical")
async def get_bin_historical_data(bin_id: int):
    """Get historical earthquake data for a specific BIN"""
    try:
        historical_data = await ml_service.get_historical_data(bin_id)
        return historical_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))