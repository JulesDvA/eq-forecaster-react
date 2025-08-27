"""
Prediction Service for Precomputed Earthquake Forecasts

This service reads precomputed prediction files and provides the same API interface
that the frontend expects, without requiring live ML inference.
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

class PredictionService:
    """Service for reading precomputed earthquake predictions."""
    
    def __init__(self, predictions_dir: str = None):
        """Initialize the prediction service.
        
        Args:
            predictions_dir: Directory containing prediction JSON files
        """
        if predictions_dir is None:
            # Default to the predictions directory in the backend
            backend_dir = Path(__file__).parent.parent.parent
            predictions_dir = backend_dir / "data" / "predictions"
        
        self.predictions_dir = Path(predictions_dir)
        self.predictions_dir.mkdir(exist_ok=True)
        
        logger.info(f"Initialized PredictionService with directory: {self.predictions_dir}")
    
    def get_available_years(self) -> List[int]:
        """Get list of years for which predictions are available."""
        try:
            years = []
            for filepath in self.predictions_dir.glob("predictions_*.json"):
                # Extract year from filename (e.g., "predictions_2024.json" -> 2024)
                try:
                    year = int(filepath.stem.split("_")[1])
                    years.append(year)
                except (IndexError, ValueError):
                    logger.warning(f"Could not parse year from filename: {filepath.name}")
                    continue
            
            years.sort()
            logger.info(f"Found predictions for years: {years}")
            return years
            
        except Exception as e:
            logger.error(f"Failed to get available years: {e}")
            return []
    
    def get_predictions_for_year(self, year: int) -> Optional[Dict[str, Any]]:
        """Get predictions for a specific year.
        
        Args:
            year: Year to get predictions for
            
        Returns:
            Dictionary containing predictions data, or None if not found
        """
        try:
            filepath = self.predictions_dir / f"predictions_{year}.json"
            
            if not filepath.exists():
                logger.warning(f"No predictions found for year {year}")
                return None
            
            with open(filepath, 'r', encoding='utf-8') as f:
                predictions = json.load(f)
            
            logger.info(f"Loaded predictions for year {year}")
            return predictions
            
        except Exception as e:
            logger.error(f"Failed to load predictions for year {year}: {e}")
            return None
    
    def get_spatial_bins_for_year(self, year: int) -> List[Dict[str, Any]]:
        """Get spatial bins with predictions for a specific year.
        
        This method provides the exact format the frontend expects.
        
        Args:
            year: Year to get predictions for
            
        Returns:
            List of spatial bins with prediction data
        """
        try:
            predictions = self.get_predictions_for_year(year)
            
            if not predictions:
                logger.warning(f"No predictions available for year {year}")
                return []
            
            # Transform predictions to the format expected by the frontend
            spatial_bins = []
            
            for pred in predictions.get('predictions', []):
                bin_data = {
                    "bin_id": pred.get("bin_id", 0),
                    "bounds": pred.get("bounds", []),
                    "earthquake_count": pred.get("earthquake_frequency", 0),
                    "max_magnitude": pred.get("max_magnitude", 0),
                    "historical_count": pred.get("historical_frequency", 0),
                    "historical_max_magnitude": pred.get("historical_max_magnitude", 0),
                    "confidence": pred.get("confidence", 0.0),
                    "year": year
                }
                
                spatial_bins.append(bin_data)
            
            logger.info(f"Returning {len(spatial_bins)} spatial bins for year {year}")
            return spatial_bins
            
        except Exception as e:
            logger.error(f"Failed to get spatial bins for year {year}: {e}")
            return []
    
    def get_latest_predictions(self) -> Optional[Dict[str, Any]]:
        """Get the most recent predictions available."""
        try:
            available_years = self.get_available_years()
            
            if not available_years:
                logger.warning("No predictions available")
                return None
            
            # Get the most recent year
            latest_year = max(available_years)
            return self.get_predictions_for_year(latest_year)
            
        except Exception as e:
            logger.error(f"Failed to get latest predictions: {e}")
            return None
    
    def get_prediction_summary(self) -> Dict[str, Any]:
        """Get a summary of all available predictions."""
        try:
            available_years = self.get_available_years()
            
            summary = {
                "total_years": len(available_years),
                "available_years": available_years,
                "latest_year": max(available_years) if available_years else None,
                "total_predictions": 0,
                "last_updated": None
            }
            
            if available_years:
                latest_predictions = self.get_predictions_for_year(max(available_years))
                if latest_predictions:
                    summary["total_predictions"] = latest_predictions.get("total_bins", 0)
                    summary["last_updated"] = latest_predictions.get("generated_at")
            
            return summary
            
        except Exception as e:
            logger.error(f"Failed to get prediction summary: {e}")
            return {
                "total_years": 0,
                "available_years": [],
                "latest_year": None,
                "total_predictions": 0,
                "last_updated": None
            }

# Create a global instance for easy access
prediction_service = PredictionService()

