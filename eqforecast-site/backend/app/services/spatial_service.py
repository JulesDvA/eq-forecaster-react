import logging
from typing import List, Optional
from datetime import datetime
from ..models.spatial_bins import SpatialBin, BinCollection, BinRiskLevel

logger = logging.getLogger(__name__)


class SpatialBinService:
    """Service for managing spatial earthquake prediction bins using real quadtree coordinates"""

    def __init__(self):
        # Initialize with the real quadtree bins from your model output
        self.bins_data = self._initialize_real_quadtree_bins()
        logger.info(f"Initialized {len(self.bins_data.bins)} real quadtree spatial bins for Philippines")

    def _initialize_real_quadtree_bins(self) -> BinCollection:
        """Initialize with the exact quadtree coordinates from your model output"""
        
        # Real quadtree bin data from your model output
        real_bins_data = [
            # Format: (id, lon_min, lon_max, lat_min, lat_max, earthquake_count)
            (0, 119.475000000000, 122.650000000000, 7.000000000000, 12.000000000000, 69),
            (1, 125.825000000000, 127.412500000000, 2.000000000000, 4.500000000000, 182),
            (2, 127.412500000000, 129.000000000000, 2.000000000000, 4.500000000000, 70),
            (3, 125.825000000000, 127.412500000000, 4.500000000000, 7.000000000000, 227),
            (4, 124.237500000000, 125.825000000000, 7.000000000000, 9.500000000000, 61),
            (5, 124.237500000000, 125.825000000000, 9.500000000000, 12.000000000000, 114),
            (6, 125.825000000000, 127.412500000000, 7.000000000000, 9.500000000000, 283),
            (7, 119.475000000000, 121.062500000000, 12.000000000000, 14.500000000000, 108),
            (8, 119.475000000000, 121.062500000000, 14.500000000000, 17.000000000000, 98),
            (9, 121.062500000000, 122.650000000000, 14.500000000000, 17.000000000000, 100),
            (10, 119.475000000000, 121.062500000000, 17.000000000000, 19.500000000000, 105),
            (11, 121.062500000000, 122.650000000000, 17.000000000000, 19.500000000000, 79),
            (12, 119.475000000000, 121.062500000000, 19.500000000000, 22.000000000000, 46),
            (13, 121.062500000000, 122.650000000000, 19.500000000000, 22.000000000000, 96),
            (14, 124.237500000000, 125.825000000000, 12.000000000000, 14.500000000000, 131),
            (15, 127.412500000000, 129.000000000000, 4.500000000000, 9.500000000000, 63),
            (16, 122.650000000000, 124.237500000000, 7.000000000000, 12.000000000000, 67),
            (17, 121.062500000000, 124.237500000000, 12.000000000000, 14.500000000000, 75),
            (18, 125.825000000000, 129.000000000000, 12.000000000000, 22.000000000000, 38),
            (19, 124.237500000000, 125.825000000000, 2.000000000000, 7.000000000000, 115),
            (20, 125.825000000000, 129.000000000000, 9.500000000000, 12.000000000000, 237),
            (21, 122.650000000000, 125.825000000000, 14.500000000000, 22.000000000000, 22),
            (22, 116.300000000000, 119.475000000000, 7.000000000000, 22.000000000000, 37),
            (23, 116.300000000000, 124.237500000000, 2.000000000000, 7.000000000000, 75)
        ]

        bins = []
        total_area = 0.0

        for bin_id, lon_min, lon_max, lat_min, lat_max, earthquake_count in real_bins_data:
            # Calculate center coordinates
            center_lon = (lon_min + lon_max) / 2
            center_lat = (lat_min + lat_max) / 2

            # Create polygon coordinates for Leaflet (clockwise order, [lat, lon] format)
            coordinates = [
                [lat_min, lon_min],  # Bottom-left
                [lat_min, lon_max],  # Bottom-right
                [lat_max, lon_max],  # Top-right
                [lat_max, lon_min],  # Top-left
                [lat_min, lon_min]   # Close polygon
            ]

            # Determine risk level based on earthquake count
            if earthquake_count >= 200:
                risk_level = BinRiskLevel.CRITICAL
                risk_score = 0.9
            elif earthquake_count >= 100:
                risk_level = BinRiskLevel.HIGH
                risk_score = 0.7
            elif earthquake_count >= 50:
                risk_level = BinRiskLevel.MEDIUM
                risk_score = 0.5
            else:
                risk_level = BinRiskLevel.LOW
                risk_score = 0.3

            # Calculate mock magnitude statistics (you can replace with real data)
            if earthquake_count > 0:
                # Generate realistic magnitude distribution based on count
                base_magnitude = 5.0 + (earthquake_count / 100) * 0.5
                avg_magnitude = min(base_magnitude, 7.0)
                max_magnitude = min(avg_magnitude + 1.5, 8.5)
            else:
                avg_magnitude = 0.0
                max_magnitude = 0.0

            # Calculate approximate area in km²
            lon_width = lon_max - lon_min
            lat_height = lat_max - lat_min
            # Rough conversion: 1 degree ≈ 111 km
            area_km2 = lon_width * lat_height * 111 * 111
            total_area += area_km2

            spatial_bin = SpatialBin(
                id=bin_id,
                name=f"Quadtree Bin {bin_id}",
                region_code=f"QB{bin_id:02d}",
                coordinates=coordinates,
                center_lat=center_lat,
                center_lon=center_lon,
                risk_level=risk_level,
                risk_score=risk_score,
                historical_earthquake_count=earthquake_count,
                avg_magnitude=round(avg_magnitude, 2),
                max_magnitude=round(max_magnitude, 2),
                color="#2563eb",  # Blue outline color
                description=f"Real quadtree bin covering {lon_width:.3f}° x {lat_height:.3f}° area with {earthquake_count} earthquakes"
            )
            bins.append(spatial_bin)

        return BinCollection(
            bins=bins,
            total_area_km2=round(total_area, 2),
            coverage_description=f"Real quadtree spatial bins with {len(bins)} regions covering Philippines",
            created_date=datetime.now(),
            last_updated=datetime.now()
        )

    def get_all_bins(self) -> BinCollection:
        """Get all spatial bins"""
        return self.bins_data

    def get_bin_by_id(self, bin_id: int) -> Optional[SpatialBin]:
        """Get a specific bin by ID"""
        for bin_obj in self.bins_data.bins:
            if bin_obj.id == bin_id:
                return bin_obj
        return None

    def get_bins_by_risk_level(self, risk_level: BinRiskLevel) -> List[SpatialBin]:
        """Get bins filtered by risk level"""
        return [bin_obj for bin_obj in self.bins_data.bins if bin_obj.risk_level == risk_level]

    def get_binning_info(self) -> dict:
        """Get information about the current binning system"""
        return {
            "total_bins": len(self.bins_data.bins),
            "total_area_km2": self.bins_data.total_area_km2,
            "coverage_description": self.bins_data.coverage_description,
            "binning_method": "Real Quadtree",
            "created_date": self.bins_data.created_date.isoformat(),
            "last_updated": self.bins_data.last_updated.isoformat(),
            "risk_level_distribution": {
                "LOW": len(self.get_bins_by_risk_level(BinRiskLevel.LOW)),
                "MEDIUM": len(self.get_bins_by_risk_level(BinRiskLevel.MEDIUM)),
                "HIGH": len(self.get_bins_by_risk_level(BinRiskLevel.HIGH)),
                "CRITICAL": len(self.get_bins_by_risk_level(BinRiskLevel.CRITICAL))
            }
        }


# Global service instance
spatial_bin_service = SpatialBinService()
