"""
API routes for earthquake forecasting
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime

from ..services.forecasting_service import forecasting_service
from ..services.quadtree import QuadtreeBinner
from ..services.prediction_service import prediction_service
import numpy as np

# Create router
router = APIRouter()


@router.get("/", summary="API Root", tags=["General"])
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Earthquake Forecasting API",
        "version": "1.0.0",
        "status": "running",
        "description": "API for earthquake data and forecasting system in the Philippines",
        "endpoints": {
            "health": "/health",
            "forecast": "/api/forecast",
            "forecast_train": "/api/forecast/train",
            "forecast_status": "/api/forecast/status",
            "forecast_data": "/api/forecast/data",
            "spatial_bins": "/api/spatial/bins",
            "available_years": "/api/spatial/available-years"
        }
    }


@router.get("/health", summary="Health Check", tags=["General"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "service": "Earthquake Forecasting API"
    }


@router.get("/api/spatial/available-years", summary="Get Available Years", tags=["Spatial"])
async def get_available_years():
    """Get list of available years for forecasting"""
    try:
        years = prediction_service.get_available_years()
        return {
            "available_years": years,
            "total_years": len(years),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get available years: {str(e)}")


@router.get("/api/spatial/bins", summary="Get Spatial Bins", tags=["Spatial"])
async def get_spatial_bins(year: int = Query(2024, description="Target year for forecasting")):
    """Get earthquake statistics for the 24 spatial bins for a specific year"""
    try:
        # Get precomputed predictions for the specified year
        spatial_bins = prediction_service.get_spatial_bins_for_year(year)
        
        if not spatial_bins:
            raise HTTPException(
                status_code=404, 
                detail=f"No predictions available for year {year}"
            )
        
        # Transform to the format expected by the frontend
        bins = []
        for bin_data in spatial_bins:
            bounds = bin_data.get("bounds", [])
            if len(bounds) >= 4:  # Ensure we have [min_lon, max_lon, min_lat, max_lat]
                min_lon, max_lon, min_lat, max_lat = bounds[:4]
                
                bins.append({
                    "id": bin_data.get("bin_id", 0),
                    "bounds": bounds,
                    "center_lat": (min_lat + max_lat) / 2,
                    "center_lon": (min_lon + max_lon) / 2,
                    "width": max_lon - min_lon,
                    "height": max_lat - min_lat,
                    "earthquake_count": bin_data.get("earthquake_count", 0),
                    "max_magnitude": bin_data.get("max_magnitude", 0)
                })
        
        return {
            "target_year": year,
            "total_bins": len(bins),
            "target_bins": 24,
            "bins": bins,
            "status": "success",
            "data_source": "precomputed_predictions"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Spatial bins generation failed: {str(e)}")


@router.get("/api/forecast", summary="Get Forecast", tags=["Forecasting"])
async def get_forecast(
    region: str = Query("all", description="Region to forecast"),
    forecast_days: int = Query(30, description="Number of days to forecast")
):
    """Get earthquake forecast for a region"""
    try:
        forecast = await forecasting_service.get_forecast(region, forecast_days)
        return forecast
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast generation failed: {str(e)}")


@router.post("/api/forecast/train", summary="Train Model", tags=["Forecasting"])
async def train_model(
    model_type: str = Query("shared_lstm", description="Type of model to train"),
    config_name: str = Query("best_balanced", description="Configuration to use")
):
    """Train a forecasting model"""
    try:
        results = await forecasting_service.train_model(model_type, config_name)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")


@router.get("/api/forecast/status", summary="Get Model Status", tags=["Forecasting"])
async def get_model_status():
    """Get the status of forecasting models and data"""
    try:
        status = await forecasting_service.get_model_status()
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")


@router.get("/api/forecast/data", summary="Get Data Summary", tags=["Forecasting"])
async def get_data_summary():
    """Get a summary of the loaded earthquake data"""
    try:
        summary = await forecasting_service.get_data_summary()
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data summary failed: {str(e)}")
