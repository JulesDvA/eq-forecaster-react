"""
Configuration settings for the Earthquake Forecasting API
"""
import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings
    API_TITLE: str = "Earthquake Forecasting API"
    API_DESCRIPTION: str = "API for earthquake data and forecasting system in the Philippines"
    API_VERSION: str = "1.0.0"
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server
        "http://localhost:8080",  # Alternative dev server
    ]
    
    # Database Settings (for future use)
    DATABASE_URL: str = "sqlite:///./earthquake_data.db"
    
    # External API Settings
    PHIVOLCS_API_URL: str = "https://earthquake.phivolcs.dost.gov.ph"
    USGS_API_URL: str = "https://earthquake.usgs.gov/fdsnws/event/1"
    
    # ML Model Settings
    MODEL_PATH: str = "./models"
    MODEL_NAME: str = "earthquake_lstm_model.pkl"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
