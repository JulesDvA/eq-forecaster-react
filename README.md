# 🌊 OPAL - Earthquake Forecasting System

A modern, AI-powered earthquake forecasting system for the Philippines, featuring an attention-driven LSTM model and a beautiful React frontend.

## ✨ Features

### 🧠 Advanced AI Technology
- **Attention-LSTM Model**: Deep learning architecture focused on seismic patterns
- **Regional Analysis**: Specialized modeling for Philippine regions
- **Real-time Predictions**: Generate earthquake magnitude forecasts with confidence intervals
- **Uncertainty Quantification**: Confidence scores and prediction intervals

### 🎨 Modern Frontend
- **Beautiful UI**: Modern, responsive design with dark theme
- **Live Data Dashboard**: Real-time earthquake activity and system status
- **Interactive Maps**: Leaflet-powered maps with regional overlays
- **Mobile Responsive**: Optimized for all device sizes

### ⚡ Powerful Backend
- **FastAPI**: High-performance async API
- **RESTful Endpoints**: Comprehensive API for data and predictions
- **Data Management**: Advanced filtering and statistical analysis
- **Auto Documentation**: Swagger/OpenAPI integration

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ with conda
- Node.js 16+
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd eq-forecaster-react
```

### 2. Easy Setup (Windows)
Simply double-click `start_dev.bat` to automatically:
- Activate the conda environment
- Start the backend server
- Start the frontend development server

### 3. Manual Setup

#### Backend Setup
```bash
# Activate conda environment
conda activate thesisconda

# Navigate to backend
cd eqforecast-site/backend

# Install dependencies
pip install -r requirements.txt

# Start the server
python start_server.py
```

#### Frontend Setup
```bash
# Navigate to frontend (in a new terminal)
cd eqforecast-site

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Access the Application

Once both servers are running:

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## 📊 API Endpoints

### Data Endpoints
- `GET /api/regions` - Get Philippine regions
- `GET /api/earthquakes` - Get earthquake data with filters
- `GET /api/statistics` - Get statistical analysis

### Prediction Endpoints
- `POST /api/predict` - Generate earthquake predictions
- `GET /api/model-info` - Get ML model information

### System Endpoints
- `GET /health` - Health check
- `GET /api/status` - System status

## 🎯 Usage Examples

### Generate a Prediction
```bash
curl -X POST "http://localhost:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "region": "NCR",
    "prediction_days": 30,
    "include_confidence": true
  }'
```

### Get Earthquake Data
```bash
# Get recent earthquakes for NCR
curl "http://localhost:8000/api/earthquakes?region=NCR&limit=10"

# Get earthquakes with magnitude >= 4.0
curl "http://localhost:8000/api/earthquakes?min_magnitude=4.0"
```

## 🏗️ Project Structure

```
eq-forecaster-react/
├── eqforecast-site/
│   ├── backend/                 # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/            # API routes
│   │   │   ├── core/           # Configuration
│   │   │   ├── models/         # Pydantic models
│   │   │   └── services/       # Business logic
│   │   ├── main.py             # FastAPI app
│   │   ├── start_server.py     # Server startup
│   │   └── requirements.txt    # Python dependencies
│   ├── src/
│   │   ├── Pages/              # React components
│   │   ├── Css/                # Stylesheets
│   │   └── services/           # API service layer
│   ├── package.json            # Node.js dependencies
│   └── vite.config.js          # Vite configuration
├── start_dev.bat               # Development startup script
└── README.md                   # This file
```

## 🔧 Configuration

### Backend Configuration
Environment variables can be set in `backend/.env`:
```env
API_TITLE="Earthquake Forecasting API"
HOST="0.0.0.0"
PORT=8000
DEBUG=true
LOG_LEVEL="INFO"
```

### Frontend Configuration
The frontend automatically connects to `http://localhost:8000` for the API.

## 📱 Features Showcase

### Landing Page
- **Live Dashboard**: Real-time earthquake data and system status
- **Interactive Stats**: Dynamic statistics from the backend
- **Modern Design**: Beautiful gradients and animations
- **Feature Cards**: Technology highlights

### Forecasting Page
- **Region Selection**: Choose from Philippine regions
- **Prediction Controls**: Set prediction timeframe
- **Interactive Map**: Click regions to select them
- **Results Display**: Beautiful prediction cards with confidence intervals
- **Recent Activity**: Live earthquake data for selected regions

## 🛠️ Development

### Adding New Features
1. **Backend**: Add new routes in `backend/app/api/routes.py`
2. **Frontend**: Create components in `src/Pages/`
3. **API Integration**: Update `src/services/api.js`
4. **Styling**: Add CSS in `src/Css/`

### Code Style
- **Backend**: Follows FastAPI best practices
- **Frontend**: Modern React with hooks
- **CSS**: Mobile-first responsive design

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on ports 8000 and 5173
   npx kill-port 8000 5173
   ```

2. **Module not found errors**
   ```bash
   # Ensure conda environment is activated
   conda activate thesisconda
   
   # Reinstall backend dependencies
   cd eqforecast-site/backend
   pip install -r requirements.txt
   ```

3. **Frontend build errors**
   ```bash
   # Clear npm cache and reinstall
   cd eqforecast-site
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **API connection errors**
   - Ensure backend is running on port 8000
   - Check if CORS is properly configured
   - Verify API endpoints in browser: http://localhost:8000/docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is part of a thesis on earthquake forecasting in the Philippines.

## ⚠️ Disclaimer

This system is for research and educational purposes only. Always follow official government advisories for earthquake preparedness and emergency response.

---

**Built with ❤️ for earthquake research and public safety**