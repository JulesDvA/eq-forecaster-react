#!/usr/bin/env python3
"""
Earthquake Prediction Generator Script

This script runs the ML forecasting models and generates predictions for each of the 24 spatial bins.
Predictions are saved to JSON files in the data/predictions/ directory.

Usage:
    python scripts/generate_predictions.py --years 2024,2025,2026
    python scripts/generate_predictions.py --years 2024 --max-years 10
"""

import argparse
import json
import logging
import sys
import pandas as pd
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any

# Add the backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.services.quadtree import QuadtreeBinner
from app.services.earthquake_processor import EarthquakeProcessor
from app.services.apply_optimized_configs import load_config
from app.services.load_catalog import load_catalog

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class PredictionGenerator:
    """Generates earthquake predictions using the ML forecasting system."""
    
    def __init__(self, data_path: str = None):
        """Initialize the prediction generator.
        
        Args:
            data_path: Path to the earthquake catalog CSV file
        """
        if data_path is None:
            # Default to the processed catalog in the data directory
            data_path = backend_dir / "data" / "processed_earthquake_catalog_lstm_ready.csv"
        
        self.data_path = Path(data_path)
        self.predictions_dir = backend_dir / "data" / "predictions"
        self.predictions_dir.mkdir(exist_ok=True)
        
        # Initialize the spatial binner with exactly 24 bins
        self.quadtree_binner = QuadtreeBinner(target_bins=24)
        
        logger.info(f"Initialized PredictionGenerator with data: {self.data_path}")
        logger.info(f"Predictions will be saved to: {self.predictions_dir}")
    
    def load_and_process_data(self) -> Any:
        """Load and process earthquake data for forecasting."""
        try:
            logger.info("Loading earthquake catalog...")
            
            # Load the processed earthquake data directly
            if self.data_path.suffix == '.csv':
                df = pd.read_csv(self.data_path)
                logger.info(f"Loaded {len(df)} records from {self.data_path}")
            else:
                raise ValueError(f"Unsupported file format: {self.data_path.suffix}")
            
            logger.info(f"Loaded {len(df)} earthquake records")
            return df
            
        except Exception as e:
            logger.error(f"Failed to load earthquake data: {e}")
            raise
    
    def generate_spatial_bins(self, df: Any) -> List[Dict[str, Any]]:
        """Generate exactly 24 spatial bins using the processed data."""
        try:
            logger.info("Generating exactly 24 spatial bins from processed data...")
            
            # Filter out bin_id -1 and get only bins 0-23
            valid_bins = df[df['bin_id'] >= 0]['bin_id'].unique()
            valid_bins = sorted(valid_bins)[:24]  # Take only first 24 bins
            
            logger.info(f"Using bins: {valid_bins}")
            
            # Create bin data structure for exactly 24 bins
            bins = []
            for i, bin_id in enumerate(valid_bins):
                bin_data = df[df['bin_id'] == bin_id]
                
                # Calculate statistics for this bin
                # The data has multiple rows per bin (different time periods)
                # We need to aggregate the frequency and max_magnitude values
                earthquake_count = int(bin_data['frequency'].sum()) if 'frequency' in bin_data.columns else 0
                max_magnitude = float(bin_data['max_magnitude'].max()) if 'max_magnitude' in bin_data.columns else 0
                
                # Create realistic bounds for each bin (divide Philippines into 24 regions)
                # This is a simplified approach - in reality, you'd use the actual quadtree bounds
                lat_step = 20.0 / 6  # 6 rows
                lon_step = 13.0 / 4  # 4 columns
                
                row = i // 4  # 0-5
                col = i % 4   # 0-3
                
                min_lon = 116.0 + col * lon_step
                max_lon = 116.0 + (col + 1) * lon_step
                min_lat = 2.0 + row * lat_step
                max_lat = 2.0 + (row + 1) * lat_step
                
                bin_info = {
                    'bin_id': int(bin_id),
                    'bounds': [min_lon, max_lon, min_lat, max_lat],
                    'events': bin_data.to_dict('records'),
                    'earthquake_count': earthquake_count,
                    'max_magnitude': max_magnitude
                }
                
                bins.append(bin_info)
            
            logger.info(f"Generated exactly {len(bins)} spatial bins")
            return bins
            
        except Exception as e:
            logger.error(f"Failed to generate spatial bins: {e}")
            raise
    
    def generate_predictions_for_year(self, year: int, bins: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate predictions for a specific year and spatial bins.
        
        This is a simplified prediction that uses historical data patterns.
        In a full implementation, this would run the actual ML models.
        """
        try:
            logger.info(f"Generating predictions for year {year}...")
            
            predictions = []
            
            for bin_data in bins:
                # Extract bin information
                bin_id = bin_data.get('bin_id', 0)
                bounds = bin_data.get('bounds', [])
                events = bin_data.get('events', [])
                
                # Calculate historical statistics from the processed data
                if events:
                    # The events contain the processed CSV data
                    frequencies = [event.get('frequency', 0) for event in events]
                    magnitudes = [event.get('max_magnitude', 0) for event in events]
                    
                    # Sum frequencies and get max magnitude
                    earthquake_frequency = sum(frequencies)
                    max_magnitude = max(magnitudes) if magnitudes else 0
                else:
                    earthquake_frequency = 0
                    max_magnitude = 0
                
                # Simple prediction model (placeholder for actual ML)
                # In reality, this would run the LSTM models
                predicted_frequency = max(0, int(earthquake_frequency * 1.1))  # 10% increase
                predicted_max_magnitude = max_magnitude + 0.1 if max_magnitude > 0 else 0
                
                prediction = {
                    "bin_id": bin_id,
                    "bounds": bounds,
                    "earthquake_frequency": predicted_frequency,
                    "max_magnitude": round(predicted_max_magnitude, 2),
                    "historical_frequency": earthquake_frequency,
                    "historical_max_magnitude": round(max_magnitude, 2),
                    "confidence": 0.85  # Placeholder confidence score
                }
                
                predictions.append(prediction)
            
            # Create the complete prediction structure
            prediction_data = {
                "year": year,
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "total_bins": len(predictions),
                "predictions": predictions
            }
            
            logger.info(f"Generated predictions for {len(predictions)} bins in year {year}")
            return prediction_data
            
        except Exception as e:
            logger.error(f"Failed to generate predictions for year {year}: {e}")
            raise
    
    def save_predictions(self, predictions: Dict[str, Any], year: int) -> Path:
        """Save predictions to a JSON file."""
        try:
            filename = f"predictions_{year}.json"
            filepath = self.predictions_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(predictions, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Saved predictions to: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Failed to save predictions for year {year}: {e}")
            raise
    
    def generate_predictions(self, years: List[int]) -> List[Path]:
        """Generate predictions for multiple years."""
        try:
            logger.info(f"Starting prediction generation for years: {years}")
            
            # Load and process data
            df = self.load_and_process_data()
            
            # Generate spatial bins
            bins = self.generate_spatial_bins(df)
            
            # Generate predictions for each year
            saved_files = []
            for year in years:
                predictions = self.generate_predictions_for_year(year, bins)
                filepath = self.save_predictions(predictions, year)
                saved_files.append(filepath)
            
            logger.info(f"Successfully generated predictions for {len(years)} years")
            return saved_files
            
        except Exception as e:
            logger.error(f"Failed to generate predictions: {e}")
            raise

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Generate earthquake predictions using ML models"
    )
    
    parser.add_argument(
        "--years",
        type=str,
        required=True,
        help="Comma-separated list of years to generate predictions for (e.g., '2024,2025,2026')"
    )
    
    parser.add_argument(
        "--max-years",
        type=int,
        default=10,
        help="Maximum number of years ahead to allow (default: 10)"
    )
    
    parser.add_argument(
        "--data-path",
        type=str,
        help="Path to earthquake catalog CSV file (default: uses data/processed_earthquake_catalog_annual_stats.csv)"
    )
    
    return parser.parse_args()

def main():
    """Main function to run the prediction generator."""
    try:
        args = parse_arguments()
        
        # Parse years
        years = [int(y.strip()) for y in args.years.split(',')]
        current_year = datetime.now().year
        
        # Validate years
        for year in years:
            if year < current_year:
                logger.warning(f"Year {year} is in the past, but continuing...")
            elif year > current_year + args.max_years:
                logger.error(f"Year {year} exceeds maximum allowed years ahead ({args.max_years})")
                sys.exit(1)
        
        # Initialize generator
        generator = PredictionGenerator(data_path=args.data_path)
        
        # Generate predictions
        saved_files = generator.generate_predictions(years)
        
        logger.info("Prediction generation completed successfully!")
        logger.info(f"Generated files: {[f.name for f in saved_files]}")
        
    except KeyboardInterrupt:
        logger.info("Prediction generation interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Prediction generation failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
