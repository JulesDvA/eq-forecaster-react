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
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server
        "http://localhost:8080",  # Alternative dev server
        "http://127.0.0.1:5173",  # Vite dev server (alternative)
    ]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
