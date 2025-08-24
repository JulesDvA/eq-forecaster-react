"""
API routes for earthquake forecasting
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime

from ..models.earthquake import (
    EarthquakeResponse, EarthquakeFilter, RegionInfo, 
    EarthquakeStatistics, PredictionRequest, PredictionResponse
)
from ..services.data_service import earthquake_service
from ..services.ml_service import ml_service
from ..services.spatial_service import spatial_bin_service

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
            "regions": "/api/regions",
            "earthquakes": "/api/earthquakes",
            "statistics": "/api/statistics",
            "predictions": "/api/predict",
            "model_info": "/api/model-info"
        }
    }


@router.get("/health", summary="Health Check", tags=["General"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "service": "Earthquake Forecasting API",
        "components": {
            "api": "healthy",
            "data_service": "healthy",
            "ml_service": "healthy" if ml_service.is_model_loaded else "limited"
        }
    }


@router.get("/api/regions", response_model=List[RegionInfo], summary="Get Regions", tags=["Data"])
async def get_regions():
    """Get available Philippine regions for earthquake forecasting"""
    try:
        regions = await earthquake_service.get_regions()
        return regions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch regions: {str(e)}")


@router.get("/api/earthquakes", response_model=List[EarthquakeResponse], summary="Get Earthquakes", tags=["Data"])
async def get_earthquakes(
    region: Optional[str] = Query(None, description="Filter by region code"),
    start_date: Optional[datetime] = Query(None, description="Start date for filtering"),
    end_date: Optional[datetime] = Query(None, description="End date for filtering"),
    min_magnitude: Optional[float] = Query(None, ge=0, le=10, description="Minimum magnitude"),
    max_magnitude: Optional[float] = Query(None, ge=0, le=10, description="Maximum magnitude"),
    min_depth: Optional[float] = Query(None, ge=0, description="Minimum depth in km"),
    max_depth: Optional[float] = Query(None, ge=0, description="Maximum depth in km"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of results")
):
    """Get historical earthquake data with optional filters"""
    try:
        filters = EarthquakeFilter(
            region=region,
            start_date=start_date,
            end_date=end_date,
            min_magnitude=min_magnitude,
            max_magnitude=max_magnitude,
            min_depth=min_depth,
            max_depth=max_depth,
            limit=limit
        )
        
        earthquakes = await earthquake_service.get_earthquakes(filters)
        return earthquakes
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid filter parameters: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch earthquake data: {str(e)}")


@router.get("/api/statistics", summary="Get Statistics", tags=["Data"])
async def get_statistics(
    region: Optional[str] = Query(None, description="Filter statistics by region code")
):
    """Get statistical information about earthquake data"""
    try:
        statistics = await earthquake_service.get_statistics(region)
        return statistics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch statistics: {str(e)}")


@router.post("/api/predict", response_model=PredictionResponse, summary="Predict Earthquake", tags=["Prediction"])
async def predict_earthquake(request: PredictionRequest):
    """Predict earthquake magnitude for a specific region"""
    try:
        prediction = await ml_service.predict_earthquake(request)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate prediction: {str(e)}")


@router.get("/api/model-info", summary="Get Model Information", tags=["Prediction"])
async def get_model_info():
    """Get information about the ML model"""
    try:
        model_info = await ml_service.get_model_info()
        return model_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch model info: {str(e)}")


@router.get("/api/spatial/bins", summary="Get Spatial Bins", tags=["Spatial"])
async def get_spatial_bins():
    """Get all spatial earthquake prediction bins"""
    try:
        bins = spatial_bin_service.get_all_bins()
        return bins
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch spatial bins: {str(e)}")


@router.get("/api/spatial/bins/{bin_id}", summary="Get Spatial Bin by ID", tags=["Spatial"])
async def get_spatial_bin(bin_id: int):
    """Get a specific spatial bin by ID"""
    try:
        bin_obj = spatial_bin_service.get_bin_by_id(bin_id)
        if bin_obj is None:
            raise HTTPException(status_code=404, detail=f"Spatial bin with ID {bin_id} not found")
        return bin_obj
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch spatial bin: {str(e)}")


@router.get("/api/spatial/bins/risk/{risk_level}", summary="Get Spatial Bins by Risk Level", tags=["Spatial"])
async def get_spatial_bins_by_risk(risk_level: str):
    """Get spatial bins filtered by risk level"""
    try:
        # Convert string to enum
        from ..models.spatial_bins import BinRiskLevel
        try:
            risk_enum = BinRiskLevel(risk_level.upper())
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid risk level: {risk_level}. Must be one of: LOW, MEDIUM, HIGH, CRITICAL")
        
        bins = spatial_bin_service.get_bins_by_risk_level(risk_enum)
        return bins
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch spatial bins by risk level: {str(e)}")


@router.get("/api/spatial/info", summary="Get Spatial Binning Info", tags=["Spatial"])
async def get_spatial_binning_info():
    """Get information about the spatial binning system"""
    try:
        info = spatial_bin_service.get_binning_info()
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch spatial binning info: {str(e)}")


@router.get("/api/status", summary="Get API Status", tags=["General"])
async def get_api_status():
    """Get overall API status and readiness"""
    try:
        return {
            "api_status": "running",
            "backend_ready": True,
            "ml_model_ready": ml_service.is_model_loaded,
            "data_service_ready": True,
            "prediction_service_ready": True,
            "spatial_binning_ready": True,
            "development_phase": "Enhanced Backend Structure with Real Quadtree Bins",
            "features": {
                "data_filtering": True,
                "region_statistics": True,
                "mock_predictions": True,
                "real_ml_predictions": ml_service.is_model_loaded,
                "confidence_intervals": True,
                "historical_data": True,
                "real_quadtree_bins": True,
                "spatial_risk_assessment": True
            },
            "next_steps": [
                "Implement real ML model training",
                "Add PHIVOLCS data integration",
                "Implement database storage",
                "Add comprehensive testing",
                "Deploy to production"
            ],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch API status: {str(e)}")
