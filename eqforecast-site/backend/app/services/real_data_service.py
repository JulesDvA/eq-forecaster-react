#!/usr/bin/env python3
"""
Real earthquake data service for spatial bins
Reads from processed earthquake catalog and aggregates by bin
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)

class RealDataService:
    def __init__(self, csv_path: str = "data/processed_earthquake_catalog_lstm_ready.csv"):
        self.csv_path = csv_path
        self.data = None
        self.load_data()
    
    def load_data(self):
        """Load earthquake catalog data"""
        try:
            self.data = pd.read_csv(self.csv_path)
            logger.info(f"Loaded earthquake catalog with {len(self.data)} records")
            logger.info(f"Columns: {list(self.data.columns)}")
            logger.info(f"Data range: {self.data['year'].min()} - {self.data['year'].max()}")
        except Exception as e:
            logger.error(f"Failed to load earthquake catalog: {e}")
            self.data = None
    
    def get_bin_statistics(self, target_year: int = 2024) -> List[Dict]:
        """
        Get earthquake statistics for each spatial bin for a target year
        Returns aggregated data: earthquake count and max magnitude per bin
        """
        if self.data is None:
            logger.error("No data loaded")
            return []
        
        try:
            # Filter data for the target year and valid bin IDs
            year_data = self.data[
                (self.data['target_year'] == target_year) & 
                (self.data['bin_id'] >= 0)  # Exclude -1.0 entries
            ].copy()
            
            if year_data.empty:
                logger.warning(f"No data found for target year {target_year}")
                return []
            
            # Group by bin_id and aggregate
            bin_stats = year_data.groupby('bin_id').agg({
                'frequency': 'sum',  # Total earthquakes in this bin
                'max_magnitude': 'max'  # Maximum magnitude in this bin
            }).reset_index()
            
            # Convert to list of dictionaries
            results = []
            for _, row in bin_stats.iterrows():
                results.append({
                    "id": int(row['bin_id']),
                    "earthquake_count": int(row['frequency']),
                    "max_magnitude": float(row['max_magnitude']) if row['max_magnitude'] > 0 else 0.0
                })
            
            # Sort by bin ID
            results.sort(key=lambda x: x['id'])
            
            logger.info(f"Generated statistics for {len(results)} bins for year {target_year}")
            return results
            
        except Exception as e:
            logger.error(f"Error generating bin statistics: {e}")
            return []
    
    def get_available_years(self) -> List[int]:
        """Get list of available years for forecasting"""
        if self.data is None:
            return []
        
        try:
            years = sorted(self.data['target_year'].unique())
            # Filter out invalid years and convert to integers
            valid_years = [int(y) for y in years if y > 1900 and y < 2100]
            return valid_years
        except Exception as e:
            logger.error(f"Error getting available years: {e}")
            return []
    
    def get_bin_coordinates(self) -> Dict[int, Dict]:
        """
        Get the exact coordinates for each of the 24 spatial bins
        These are the fixed geographical boundaries
        """
        return {
            0: {"lon": [119.475, 122.65], "lat": [7.0, 12.0]},
            1: {"lon": [125.825, 127.4125], "lat": [2.0, 4.5]},
            2: {"lon": [127.4125, 129.0], "lat": [2.0, 4.5]},
            3: {"lon": [125.825, 127.4125], "lat": [4.5, 7.0]},
            4: {"lon": [124.2375, 125.825], "lat": [7.0, 9.5]},
            5: {"lon": [124.2375, 125.825], "lat": [9.5, 12.0]},
            6: {"lon": [125.825, 127.4125], "lat": [7.0, 9.5]},
            7: {"lon": [119.475, 121.0625], "lat": [12.0, 14.5]},
            8: {"lon": [119.475, 121.0625], "lat": [14.5, 17.0]},
            9: {"lon": [121.0625, 122.65], "lat": [14.5, 17.0]},
            10: {"lon": [119.475, 121.0625], "lat": [17.0, 19.5]},
            11: {"lon": [121.0625, 122.65], "lat": [17.0, 19.5]},
            12: {"lon": [119.475, 121.0625], "lat": [19.5, 22.0]},
            13: {"lon": [121.0625, 122.65], "lat": [19.5, 22.0]},
            14: {"lon": [124.2375, 125.825], "lat": [12.0, 14.5]},
            15: {"lon": [127.4125, 129.0], "lat": [4.5, 9.5]},
            16: {"lon": [122.65, 124.2375], "lat": [7.0, 12.0]},
            17: {"lon": [121.0625, 124.2375], "lat": [12.0, 14.5]},
            18: {"lon": [125.825, 129.0], "lat": [12.0, 22.0]},
            19: {"lon": [124.2375, 125.825], "lat": [2.0, 7.0]},
            20: {"lon": [125.825, 129.0], "lat": [9.5, 12.0]},
            21: {"lon": [122.65, 125.825], "lat": [14.5, 22.0]},
            22: {"lon": [116.3, 119.475], "lat": [7.0, 22.0]},
            23: {"lon": [116.3, 124.2375], "lat": [2.0, 7.0]}
        }

# Create global instance
real_data_service = RealDataService()


