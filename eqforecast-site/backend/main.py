from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.api.routes import router

# Configure logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting Earthquake Forecasting API...")
    
    # Initialize forecasting service
    try:
        from app.services.forecasting_service import forecasting_service
        await forecasting_service.initialize()
        logger.info("Forecasting service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize forecasting service: {e}")
        logger.warning("Forecasting endpoints may not work properly")
    
    logger.info("API startup complete")
