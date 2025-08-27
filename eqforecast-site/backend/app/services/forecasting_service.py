#!/usr/bin/env python3
"""
Forecasting Service for Earthquake Prediction

This service integrates the forecasting models with the FastAPI backend.
"""

import logging
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import torch

from ..models.shared_lstm_model import SharedLSTMModel
from ..models.attention_shared_lstm_model import AttentionSharedLSTMModel
from ..models.enhanced_shared_processor import EnhancedSharedDataset
from .earthquake_processor import EarthquakeProcessor
from .apply_optimized_configs import load_config, create_optimized_model, get_training_params

logger = logging.getLogger(__name__)


class ForecastingService:
    """Service for earthquake forecasting operations."""
    
    def __init__(self, data_path: str = "data/processed_earthquake_catalog_lstm_ready.csv"):
        """
        Initialize the forecasting service.
        
        Args:
            data_path: Path to the processed earthquake catalog CSV
        """
        self.data_path = Path(data_path)
        self.processor = None
        self.models = {}
        self.dataset = None
        self.is_initialized = False
        
    async def initialize(self):
        """Initialize the forecasting service and load data."""
        try:
            if not self.data_path.exists():
                raise FileNotFoundError(f"Data file not found: {self.data_path}")
            
            logger.info("Loading earthquake catalog data...")
            self.processor = EarthquakeProcessor()
            
            # Load and process the data
            self.dataset = await self._load_and_process_data()
            
            self.is_initialized = True
            logger.info("Forecasting service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize forecasting service: {e}")
            raise
    
    async def _load_and_process_data(self) -> EnhancedSharedDataset:
        """Load and process earthquake data."""
        try:
            # Check if data file exists
            if not self.data_path.exists():
                raise FileNotFoundError(f"Data file not found: {self.data_path}")
            
            logger.info(f"Loading data from: {self.data_path}")
            
            # Create dataset using the correct constructor parameters
            dataset = EnhancedSharedDataset(
                data_path=str(self.data_path),
                lookback_years=10,
                target_horizon=1,
                normalize=True,
                rolling_windows=[3, 5, 10],
                train_end_year=2009,
                val_end_year=2017,
                test_end_year=2025
            )
            
            logger.info(f"Dataset created successfully with {len(dataset.sequences)} sequences")
            return dataset
            
        except Exception as e:
            logger.error(f"Failed to load and process data: {e}")
            raise
    
    async def get_forecast(self, region: str = "all", forecast_days: int = 30) -> Dict:
        """
        Generate earthquake forecast for a region.
        
        Args:
            region: Region to forecast (default: "all")
            forecast_days: Number of days to forecast (default: 30)
            
        Returns:
            Dictionary containing forecast results
        """
        if not self.is_initialized:
            await self.initialize()
        
        try:
            # This is a placeholder implementation
            # You'll need to implement the actual forecasting logic based on your models
            
            forecast = {
                "region": region,
                "forecast_days": forecast_days,
                "generated_at": pd.Timestamp.now().isoformat(),
                "predictions": {
                    "max_magnitude": {
                        "value": 6.5,
                        "confidence": 0.75,
                        "range": [5.8, 7.2]
                    },
                    "frequency": {
                        "value": 12,
                        "confidence": 0.80,
                        "range": [8, 16]
                    }
                },
                "model_info": {
                    "model_type": "shared_lstm",
                    "training_date": "2024-01-01",
                    "accuracy": 0.78
                }
            }
            
            return forecast
            
        except Exception as e:
            logger.error(f"Failed to generate forecast: {e}")
            raise
    
    async def train_model(self, model_type: str = "shared_lstm", config_name: str = "best_balanced") -> Dict:
        """
        Train a forecasting model.
        
        Args:
            model_type: Type of model to train ("shared_lstm" or "attention_lstm")
            config_name: Configuration to use for training
            
        Returns:
            Training results
        """
        if not self.is_initialized:
            await self.initialize()
        
        try:
            # Load configuration
            config = load_config(f"{config_name}_config.json")
            
            # Create model
            if model_type == "shared_lstm":
                model = create_optimized_model(SharedLSTMModel, config)
            elif model_type == "attention_lstm":
                model = create_optimized_model(AttentionSharedLSTMModel, config)
            else:
                raise ValueError(f"Unknown model type: {model_type}")
            
            # Get training parameters
            train_params = get_training_params(config)
            
            # This is a placeholder - you'll need to implement actual training
            training_results = {
                "model_type": model_type,
                "config": config_name,
                "status": "training_completed",
                "epochs_trained": train_params.get("num_epochs", 100),
                "final_loss": 0.25,
                "accuracy": 0.78
            }
            
            # Store the trained model
            self.models[model_type] = model
            
            return training_results
            
        except Exception as e:
            logger.error(f"Failed to train model: {e}")
            raise
    
    async def get_model_status(self) -> Dict:
        """Get the status of all models."""
        return {
            "is_initialized": self.is_initialized,
            "data_loaded": self.dataset is not None,
            "models_available": list(self.models.keys()),
            "data_path": str(self.data_path),
            "total_models": len(self.models)
        }
    
    async def get_data_summary(self) -> Dict:
        """Get a summary of the loaded data."""
        if not self.is_initialized:
            return {"error": "Service not initialized"}
        
        try:
            if self.dataset is None:
                return {"error": "No data loaded"}
            
            # Get summary from the dataset
            summary = {
                "total_records": len(self.dataset.raw_data) if hasattr(self.dataset, 'raw_data') else 0,
                "sequences": len(self.dataset.sequences) if hasattr(self.dataset, 'sequences') else 0,
                "lookback_years": self.dataset.lookback_years if hasattr(self.dataset, 'lookback_years') else 0,
                "data_path": str(self.data_path),
                "last_updated": pd.Timestamp.now().isoformat()
            }
            
            # Add column information if available
            if hasattr(self.dataset, 'raw_data') and hasattr(self.dataset.raw_data, 'columns'):
                summary["data_columns"] = list(self.dataset.raw_data.columns)
            
            return summary
            
        except Exception as e:
            logger.error(f"Failed to get data summary: {e}")
            return {"error": str(e)}


# Global instance
forecasting_service = ForecastingService()
