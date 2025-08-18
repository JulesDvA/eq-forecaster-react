# app/services/ml_service.py
import numpy as np
import pandas as pd
import tensorflow as tf  # or torch if using PyTorch
from typing import List, Optional
from pathlib import Path
import joblib
import os
from app.models import EarthquakeData

class MLService:
    """Service for handling LSTM earthquake prediction model"""
    
    def __init__(self):
        # Paths to your trained model and preprocessors
        self.model_path = "models/lstm_earthquake_model.h5"  # Adjust path
        self.scaler_path = "models/scaler.pkl"  # If you used preprocessing
        self.model = None
        self.scaler = None
        self.load_model()
    
    def load_model(self):
        """Load the trained LSTM model and preprocessors"""
        try:
            # Load your trained model
            if os.path.exists(self.model_path):
                self.model = tf.keras.models.load_model(self.model_path)
                print(f"✅ Model loaded from {self.model_path}")
            else:
                print(f"⚠️ Model not found at {self.model_path}, using mock predictions")
            
            # Load scaler if you used one during training
            if os.path.exists(self.scaler_path):
                self.scaler = joblib.load(self.scaler_path)
                print(f"✅ Scaler loaded from {self.scaler_path}")
                
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            self.model = None
    
    async def predict_earthquakes(self, year: int, bins: Optional[List[int]] = None) -> List[EarthquakeData]:
        """Generate earthquake predictions using your trained LSTM model"""
        
        predictions = []
        target_bins = bins if bins else [1, 2, 3, 4]
        
        for bin_id in target_bins:
            try:
                if self.model is not None:
                    # Use your actual model
                    prediction = self._predict_with_model(bin_id, year)
                else:
                    # Fallback to mock if model not loaded
                    prediction = self._generate_mock_prediction(bin_id, year)
                
                predictions.append(prediction)
                
            except Exception as e:
                print(f"Error predicting for BIN {bin_id}: {e}")
                # Fallback to mock prediction
                prediction = self._generate_mock_prediction(bin_id, year)
                predictions.append(prediction)
        
        return predictions
    
    def _predict_with_model(self, bin_id: int, year: int) -> EarthquakeData:
        """Use your actual trained LSTM model for prediction"""
        
        # Prepare input data for your model
        # This depends on how you structured your training data
        # Example - adjust based on your model's input format:
        
        # Historical data preparation (adjust to match your training)
        historical_features = self._prepare_historical_features(bin_id, year)
        
        # Reshape for LSTM input [samples, timesteps, features]
        model_input = np.array(historical_features).reshape(1, -1, historical_features.shape[-1])
        
        # Scale if you used scaling during training
        if self.scaler:
            original_shape = model_input.shape
            model_input = self.scaler.transform(model_input.reshape(-1, original_shape[-1]))
            model_input = model_input.reshape(original_shape)
        
        # Make prediction
        prediction = self.model.predict(model_input, verbose=0)
        
        # Process model output (adjust based on your model's output format)
        max_magnitude = float(prediction[0][0]) if prediction[0][0] > 0 else 4.5
        num_earthquakes = int(prediction[0][1]) if len(prediction[0]) > 1 else 10
        
        # Calculate confidence based on model uncertainty (optional)
        confidence = self._calculate_confidence(prediction)
        
        return EarthquakeData(
            bin_id=bin_id,
            max_magnitude=round(max_magnitude, 2),
            num_earthquakes=max(1, num_earthquakes),  # Ensure at least 1
            confidence=round(confidence, 3)
        )
    
    def _prepare_historical_features(self, bin_id: int, year: int) -> np.ndarray:
        """Prepare historical features for model input"""
        # This should match how you prepared training data
        
        # Example: Load historical earthquake data for the BIN
        # Replace with your actual data loading logic
        historical_data = self._load_historical_data(bin_id)
        
        # Feature engineering (match your training preprocessing)
        # Example features might include:
        # - Previous earthquake counts
        # - Previous magnitudes
        # - Time-based features
        # - Geological features
        
        features = []
        # Add your feature extraction logic here
        # This is just an example:
        for i in range(10):  # Last 10 years of data
            year_data = historical_data.get(year - i - 1, {'count': 0, 'max_mag': 0})
            features.extend([year_data['count'], year_data['max_mag']])
        
        return np.array(features)
    
    def _load_historical_data(self, bin_id: int) -> dict:
        """Load historical earthquake data for a BIN"""
        # Replace with actual database query or file loading
        # This should match your training data source
        
        mock_data = {}
        for year in range(2010, 2024):
            mock_data[year] = {
                'count': np.random.poisson(5 + bin_id),
                'max_mag': 4.0 + np.random.exponential(1.5)
            }
        return mock_data
    
    def _calculate_confidence(self, prediction: np.ndarray) -> float:
        """Calculate prediction confidence"""
        # You can implement uncertainty estimation here
        # For example, using model ensemble or dropout uncertainty
        base_confidence = 0.85
        
        # Simple confidence based on prediction magnitude
        magnitude_factor = min(1.0, prediction[0][0] / 7.0)  # Scale by magnitude
        return base_confidence + (0.1 * magnitude_factor)
    
    def _generate_mock_prediction(self, bin_id: int, year: int) -> EarthquakeData:
        """Fallback mock prediction when model isn't available"""
        risk_multipliers = {1: 0.5, 2: 1.5, 3: 1.0, 4: 1.2}
        base_magnitude = 5.0
        base_count = 10
        
        multiplier = risk_multipliers.get(bin_id, 1.0)
        
        return EarthquakeData(
            bin_id=bin_id,
            max_magnitude=round(base_magnitude + (multiplier * 0.5), 2),
            num_earthquakes=int(base_count * multiplier),
            confidence=round(0.75 + (np.random.random() * 0.1), 3)  # Lower confidence for mock
        )
    
    async def get_historical_data(self, bin_id: int) -> dict:
        """Get historical earthquake data for visualization"""
        historical_data = self._load_historical_data(bin_id)
        
        # Format for frontend consumption
        years = list(historical_data.keys())
        counts = [data['count'] for data in historical_data.values()]
        max_mags = [data['max_mag'] for data in historical_data.values()]
        
        return {
            "bin_id": bin_id,
            "years": years,
            "earthquake_counts": counts,
            "max_magnitudes": [round(mag, 2) for mag in max_mags],
            "model_version": "LSTM-v1.0" if self.model else "Mock-v0.1"
        }