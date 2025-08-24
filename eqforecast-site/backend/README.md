# Earthquake Forecasting API Backend

A comprehensive FastAPI-based backend service for earthquake data analysis and prediction in the Philippines.

## 🚀 Features

- **RESTful API**: Comprehensive endpoints for earthquake data and predictions
- **Machine Learning**: LSTM-based earthquake magnitude prediction (development)
- **Data Management**: Earthquake data filtering, statistics, and regional analysis
- **Philippine Focus**: Specialized for Philippine earthquake data and regions
- **Async Support**: Full async/await support for high performance
- **Documentation**: Auto-generated API documentation with Swagger/OpenAPI

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py          # API endpoint definitions
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py          # Configuration settings
│   ├── database/
│   │   ├── __init__.py
│   │   └── models.py          # Database models (future)
│   ├── models/
│   │   ├── __init__.py
│   │   └── earthquake.py      # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── data_service.py    # Data management service
│   │   └── ml_service.py      # ML prediction service
│   └── __init__.py
├── models/                    # ML model files (created automatically)
├── main.py                    # FastAPI application entry point
├── start_server.py            # Server startup script
├── requirements.txt           # Python dependencies
├── env.example               # Environment configuration example
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Activate Conda Environment
```bash
conda activate thesisconda
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configuration (Optional)
```bash
cp env.example .env
# Edit .env file as needed
```

### 4. Start the Server
```bash
# Option 1: Using the startup script (recommended)
python start_server.py

# Option 2: Using uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Option 3: Using Python module
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Access the API
- **API Base URL**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📋 API Endpoints

### General
- `GET /` - API root information
- `GET /health` - Health check
- `GET /api/status` - Detailed API status

### Data Endpoints
- `GET /api/regions` - Get Philippine regions
- `GET /api/earthquakes` - Get earthquake data with filtering
- `GET /api/statistics` - Get earthquake statistics

### Prediction Endpoints
- `POST /api/predict` - Predict earthquake magnitude
- `GET /api/model-info` - Get ML model information

## 💡 API Usage Examples

### Get Earthquakes with Filters
```bash
# Get earthquakes for NCR region with magnitude >= 4.0
curl "http://localhost:8000/api/earthquakes?region=NCR&min_magnitude=4.0"

# Get recent earthquakes with date range
curl "http://localhost:8000/api/earthquakes?start_date=2024-01-01T00:00:00Z&limit=50"
```

### Make Predictions
```bash
curl -X POST "http://localhost:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "region": "NCR",
    "prediction_days": 30,
    "include_confidence": true
  }'
```

## 🔧 Development Status

### ✅ Completed Features
- Enhanced FastAPI application structure
- Comprehensive API endpoints
- Pydantic models for data validation
- Service layer architecture
- Configuration management
- Mock prediction system with confidence intervals
- CORS support for frontend integration
- Detailed API documentation

### 🚧 In Development
- Real ML model integration
- PHIVOLCS data integration
- Database storage
- Authentication & authorization
- Rate limiting
- Comprehensive testing

### 📋 Planned Features
- Real-time earthquake data feeds
- Advanced prediction algorithms
- Historical data analysis
- Email/SMS alerts
- Performance monitoring

## ⚙️ Configuration

Configure using environment variables or `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| `API_TITLE` | API title | "Earthquake Forecasting API" |
| `HOST` | Server host | "0.0.0.0" |
| `PORT` | Server port | 8000 |
| `DEBUG` | Debug mode | true |
| `LOG_LEVEL` | Logging level | "INFO" |

## 🐛 Troubleshooting

1. **Port already in use**: Change the port in configuration or kill existing processes
2. **Import errors**: Ensure you're in the `thesisconda` environment and all dependencies are installed
3. **CORS issues**: Check allowed origins in configuration
4. **Module not found**: Make sure you're running from the backend directory

## 📝 Notes

- Enhanced architecture with proper separation of concerns
- Mock predictions available for development
- Designed to work with the React frontend
- Uses your existing `thesisconda` conda environment
- Ready for ML model integration

