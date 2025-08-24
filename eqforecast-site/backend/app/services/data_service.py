"""
Data service for earthquake data management
"""
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import asyncio
import aiohttp
import json

from ..models.earthquake import EarthquakeResponse, EarthquakeFilter, RegionInfo
from ..core.config import settings

logger = logging.getLogger(__name__)


class EarthquakeDataService:
    """Service for managing earthquake data"""
    
    def __init__(self):
        self.sample_data = self._load_sample_data()
        self.regions_data = self._load_regions_data()
    
    def _load_sample_data(self) -> List[Dict[str, Any]]:
        """Load sample earthquake data"""
        return [
            {
                "id": "EQ_001",
                "timestamp": "2024-01-15T10:30:00Z",
                "latitude": 14.5995,
                "longitude": 120.9842,
                "depth": 45.2,
                "magnitude": 4.5,
                "region": "NCR",
                "location_description": "Manila Bay Area",
                "source": "PHIVOLCS"
            },
            {
                "id": "EQ_002",
                "timestamp": "2024-01-14T15:20:00Z",
                "latitude": 16.4023,
                "longitude": 120.5960,
                "depth": 67.8,
                "magnitude": 3.8,
                "region": "CAR",
                "location_description": "Baguio City Area",
                "source": "PHIVOLCS"
            },
            {
                "id": "EQ_003",
                "timestamp": "2024-01-13T08:45:00Z",
                "latitude": 13.7563,
                "longitude": 121.0583,
                "depth": 23.4,
                "magnitude": 5.2,
                "region": "Region IV-A",
                "location_description": "Laguna Lake Area",
                "source": "PHIVOLCS"
            },
            {
                "id": "EQ_004",
                "timestamp": "2024-01-12T14:15:00Z",
                "latitude": 15.2500,
                "longitude": 120.5833,
                "depth": 35.0,
                "magnitude": 4.1,
                "region": "Region I",
                "location_description": "La Union Area",
                "source": "PHIVOLCS"
            },
            {
                "id": "EQ_005",
                "timestamp": "2024-01-11T09:30:00Z",
                "latitude": 17.5000,
                "longitude": 121.0000,
                "depth": 50.5,
                "magnitude": 4.5,
                "region": "Region II",
                "location_description": "Cagayan Valley",
                "source": "PHIVOLCS"
            }
        ]
    
    def _load_regions_data(self) -> List[Dict[str, Any]]:
        """Load Philippine regions data"""
        return [
            {"name": "NCR", "code": "NCR", "earthquake_count": 45, "last_earthquake": "2024-01-15T10:30:00Z", "avg_magnitude": 4.2},
            {"name": "CAR", "code": "CAR", "earthquake_count": 32, "last_earthquake": "2024-01-14T15:20:00Z", "avg_magnitude": 3.8},
            {"name": "Region I", "code": "REGION_1", "earthquake_count": 28, "last_earthquake": "2024-01-12T14:15:00Z", "avg_magnitude": 4.1},
            {"name": "Region II", "code": "REGION_2", "earthquake_count": 35, "last_earthquake": "2024-01-11T09:30:00Z", "avg_magnitude": 4.5},
            {"name": "Region III", "code": "REGION_3", "earthquake_count": 52, "last_earthquake": "2024-01-10T16:45:00Z", "avg_magnitude": 4.3},
            {"name": "Region IV-A", "code": "REGION_4A", "earthquake_count": 41, "last_earthquake": "2024-01-13T08:45:00Z", "avg_magnitude": 4.7},
            {"name": "Region IV-B", "code": "REGION_4B", "earthquake_count": 23, "last_earthquake": "2024-01-09T11:20:00Z", "avg_magnitude": 3.9},
            {"name": "Region V", "code": "REGION_5", "earthquake_count": 38, "last_earthquake": "2024-01-08T13:10:00Z", "avg_magnitude": 4.0},
            {"name": "Region VI", "code": "REGION_6", "earthquake_count": 29, "last_earthquake": "2024-01-07T07:55:00Z", "avg_magnitude": 3.7},
            {"name": "Region VII", "code": "REGION_7", "earthquake_count": 34, "last_earthquake": "2024-01-06T12:40:00Z", "avg_magnitude": 4.1},
            {"name": "Region VIII", "code": "REGION_8", "earthquake_count": 31, "last_earthquake": "2024-01-05T18:25:00Z", "avg_magnitude": 4.4},
            {"name": "Region IX", "code": "REGION_9", "earthquake_count": 26, "last_earthquake": "2024-01-04T10:15:00Z", "avg_magnitude": 3.6},
            {"name": "Region X", "code": "REGION_10", "earthquake_count": 33, "last_earthquake": "2024-01-03T14:50:00Z", "avg_magnitude": 4.2},
            {"name": "Region XI", "code": "REGION_11", "earthquake_count": 27, "last_earthquake": "2024-01-02T09:35:00Z", "avg_magnitude": 3.9},
            {"name": "Region XII", "code": "REGION_12", "earthquake_count": 24, "last_earthquake": "2024-01-01T16:20:00Z", "avg_magnitude": 3.8},
            {"name": "Region XIII", "code": "REGION_13", "earthquake_count": 22, "last_earthquake": "2023-12-31T11:05:00Z", "avg_magnitude": 3.5},
            {"name": "ARMM", "code": "ARMM", "earthquake_count": 19, "last_earthquake": "2023-12-30T08:30:00Z", "avg_magnitude": 3.7}
        ]
    
    async def get_earthquakes(self, filters: EarthquakeFilter) -> List[EarthquakeResponse]:
        """Get earthquakes with filtering"""
        try:
            earthquakes = self.sample_data.copy()
            
            # Apply filters
            if filters.region:
                earthquakes = [eq for eq in earthquakes if eq["region"] == filters.region]
            
            if filters.min_magnitude is not None:
                earthquakes = [eq for eq in earthquakes if eq["magnitude"] >= filters.min_magnitude]
            
            if filters.max_magnitude is not None:
                earthquakes = [eq for eq in earthquakes if eq["magnitude"] <= filters.max_magnitude]
            
            if filters.min_depth is not None:
                earthquakes = [eq for eq in earthquakes if eq["depth"] >= filters.min_depth]
            
            if filters.max_depth is not None:
                earthquakes = [eq for eq in earthquakes if eq["depth"] <= filters.max_depth]
            
            # Apply date filters if provided
            if filters.start_date or filters.end_date:
                filtered_by_date = []
                for eq in earthquakes:
                    eq_date = datetime.fromisoformat(eq["timestamp"].replace('Z', '+00:00'))
                    if filters.start_date and eq_date < filters.start_date:
                        continue
                    if filters.end_date and eq_date > filters.end_date:
                        continue
                    filtered_by_date.append(eq)
                earthquakes = filtered_by_date
            
            # Apply limit
            earthquakes = earthquakes[:filters.limit]
            
            # Convert to response models
            return [EarthquakeResponse(**eq) for eq in earthquakes]
            
        except Exception as e:
            logger.error(f"Error fetching earthquakes: {e}")
            raise
    
    async def get_regions(self) -> List[RegionInfo]:
        """Get available regions"""
        try:
            return [RegionInfo(**region) for region in self.regions_data]
        except Exception as e:
            logger.error(f"Error fetching regions: {e}")
            raise
    
    async def get_statistics(self, region: Optional[str] = None) -> Dict[str, Any]:
        """Get earthquake statistics"""
        try:
            if region:
                earthquakes = [eq for eq in self.sample_data if eq["region"] == region]
            else:
                earthquakes = self.sample_data
            
            if not earthquakes:
                return {
                    "region": region,
                    "total_earthquakes": 0,
                    "magnitude_stats": {"mean": 0, "min": 0, "max": 0, "count": 0},
                    "depth_stats": {"mean": 0, "min": 0, "max": 0, "count": 0},
                    "data_source": "Sample Data (Development)",
                    "last_updated": datetime.now()
                }
            
            magnitudes = [eq["magnitude"] for eq in earthquakes]
            depths = [eq["depth"] for eq in earthquakes]
            
            magnitude_stats = {
                "mean": round(sum(magnitudes) / len(magnitudes), 2),
                "min": min(magnitudes),
                "max": max(magnitudes),
                "count": len(magnitudes)
            }
            
            depth_stats = {
                "mean": round(sum(depths) / len(depths), 2),
                "min": min(depths),
                "max": max(depths),
                "count": len(depths)
            }
            
            return {
                "region": region,
                "total_earthquakes": len(earthquakes),
                "magnitude_stats": magnitude_stats,
                "depth_stats": depth_stats,
                "data_source": "Sample Data (Development)",
                "last_updated": datetime.now()
            }
            
        except Exception as e:
            logger.error(f"Error calculating statistics: {e}")
            raise
    
    async def fetch_phivolcs_data(self) -> List[Dict[str, Any]]:
        """Fetch data from PHIVOLCS API (placeholder for future implementation)"""
        # This would implement actual PHIVOLCS API integration
        logger.info("PHIVOLCS data fetch not yet implemented")
        return []
    
    async def fetch_usgs_data(self, region_bounds: Dict[str, float]) -> List[Dict[str, Any]]:
        """Fetch data from USGS API for Philippine region"""
        # This would implement USGS API integration for Philippine earthquakes
        logger.info("USGS data fetch not yet implemented")
        return []


# Create service instance
earthquake_service = EarthquakeDataService()
