import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "../Css/Forecasting.css";
import apiService from "../../Backend/app/services/api";

const ForecastPage = ({ navigateToPage }) => {
  const [inputYear, setInputYear] = useState("");
  const [forecastData, setForecastData] = useState([
    { bin: 1, maxMag: "-", noOfEq: "-" },
    { bin: 2, maxMag: "-", noOfEq: "-" },
    { bin: 3, maxMag: "-", noOfEq: "-" },
    { bin: 4, maxMag: "-", noOfEq: "-" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState('Not trained');

  // Fix for default markers
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  // Create custom icons
  const cityIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const alertIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Load initial data and model status
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const modelData = await apiService.getModelInfo();
        setModelStatus(modelData.is_loaded ? 'Model ready' : 'Model not loaded');
      } catch (error) {
        console.error('Error fetching model info:', error);
        setModelStatus('Backend not connected');
      }
    };
    
    fetchInitialData();
  }, []);

  // Define earthquake forecast regions as polygons
  const regions = [
    {
      name: 'Northern Luzon',
      risk: 'low',
      bin: 1,
      color: '#22c55e',
      positions: [
        [18.5, 120.5],
        [18.5, 122.0],
        [16.5, 122.0],
        [16.5, 120.5]
      ]
    },
    {
      name: 'Central Luzon',
      risk: 'high',
      bin: 2,
      color: '#dc2626',
      positions: [
        [16.5, 120.0],
        [16.5, 122.5],
        [14.0, 122.5],
        [14.0, 120.0]
      ]
    },
    {
      name: 'Southern Luzon',
      risk: 'medium',
      bin: 3,
      color: '#a16207',
      positions: [
        [14.0, 120.5],
        [14.0, 124.0],
        [12.0, 124.0],
        [12.0, 120.5]
      ]
    },
    {
      name: 'Mindanao',
      risk: 'attention',
      bin: 4,
      color: '#9333ea',
      positions: [
        [10.0, 121.0],
        [10.0, 126.5],
        [5.0, 126.5],
        [5.0, 121.0]
      ]
    }
  ];

  // City locations
  const cities = [
    { name: 'Baguio', lat: 16.4023, lng: 120.5934 },
    { name: 'Angeles', lat: 15.1450, lng: 120.5860 },
    { name: 'Manila', lat: 14.5995, lng: 120.9842 },
    { name: 'Davao', lat: 7.0731, lng: 125.6085 }
  ];

  const handleYearSubmit = async () => {
    if (!inputYear) {
      alert("Please enter a year");
      return;
    }

    setIsLoading(true);
    try {
      // Generate predictions for all regions using the backend
      const predictions = await Promise.all([
        apiService.predictEarthquake({ region: 'NCR', prediction_days: 365, include_confidence: true }),
        apiService.predictEarthquake({ region: 'CAR', prediction_days: 365, include_confidence: true }),
        apiService.predictEarthquake({ region: 'Region IV-A', prediction_days: 365, include_confidence: true }),
        apiService.predictEarthquake({ region: 'Region VII', prediction_days: 365, include_confidence: true })
      ]);

      // Update forecast data with backend predictions
      const newForecastData = predictions.map((pred, index) => ({
        bin: index + 1,
        maxMag: pred.predicted_magnitude.toFixed(1),
        noOfEq: Math.floor(Math.random() * 50) + 10 // Mock earthquake count
      }));

      setForecastData(newForecastData);
      setModelStatus('Model trained and forecasting');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to backend. Make sure the API server is running on http://localhost:8000');
    } finally {
      setIsLoading(false);
    }
  };

  const trainModel = async () => {
    setIsLoading(true);
    try {
      // Check model status from backend
      const modelInfo = await apiService.getModelInfo();
      setModelStatus(modelInfo.is_loaded ? 'Model trained successfully' : 'Model training (mock mode)');
      alert('Connected to backend successfully! Model status: ' + modelInfo.status);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to backend. Make sure the API server is running on http://localhost:8000');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forecast-page-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="logo">OPAL</div>
          <div className="nav-menu">
            <button
              onClick={() => navigateToPage(1)}
              className="nav-item"
            >
              Overview
            </button>
            <button onClick={() => navigateToPage(3)} className="nav-item">
              About
            </button>
            <button onClick={() => navigateToPage(4)} className="nav-item">
              Hotlines
            </button>
            <button onClick={() => navigateToPage(2)} className="nav-item">
              Awareness
            </button>
            <button className="forecast-btn active">Forecast Now</button>
          </div>
        </div>
      </div>

      <div className="forecast-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="input-section">
            <label className="input-label">Input Year</label>
            <input
              type="number"
              value={inputYear}
              onChange={(e) => setInputYear(e.target.value)}
              className="year-input"
              placeholder="Enter year"
            />
            <button 
              onClick={handleYearSubmit} 
              className="forecast-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Forecast'}
            </button>
            <button 
              onClick={trainModel} 
              className="train-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Training...' : 'Train LSTM Model'}
            </button>
            <div className="model-status">
              Status: {modelStatus}
            </div>
          </div>

          <div className="forecast-table-section">
            <h3 className="table-title">Annual Forecast for the Year {inputYear || '----'}</h3>
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>BINS</th>
                  <th>MAX MAG.</th>
                  <th>NO. OF EQ</th>
                </tr>
              </thead>
              <tbody>
                {forecastData.map((row, index) => (
                  <tr key={index}>
                    <td>BIN {row.bin}</td>
                    <td>{row.maxMag}</td>
                    <td>{row.noOfEq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bin-selection-section">
            <h3 className="selection-title">Select a BIN</h3>
            <div className="bin-id-label">BIN ID NO.</div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="map-area">
          <div className="map-container">
            <MapContainer
              center={[12.8797, 121.7740]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Earthquake forecast regions */}
              {regions.map((region, index) => (
                <Polygon
                  key={index}
                  positions={region.positions}
                  pathOptions={{
                    fillColor: region.color,
                    fillOpacity: 0.6,
                    color: '#ffffff',
                    weight: 2
                  }}
                >
                  <Popup>
                    <div>
                      <strong>{region.name}</strong><br/>
                      Risk Level: {region.risk}<br/>
                      BIN: {region.bin}
                    </div>
                  </Popup>
                </Polygon>
              ))}

              {/* City markers */}
              {cities.map((city, index) => (
                <Marker
                  key={index}
                  position={[city.lat, city.lng]}
                  icon={cityIcon}
                >
                  <Popup>
                    <strong>{city.name}</strong>
                  </Popup>
                </Marker>
              ))}

              {/* Special attention marker */}
              <Marker
                position={[7.0731, 125.6085]}
                icon={alertIcon}
              >
                <Popup>
                  <div style={{ color: '#dc2626', fontWeight: 'bold' }}>
                    ⚠️ ATTENTION DEFICIT<br/>
                    Special monitoring required
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          
          <div className="forecasting-disclaimer">
            Disclaimer: For informational and research purposes only
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;