import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Css/Forecasting.css";

const ForecastPage = ({ navigateToPage, isLoggedIn }) => {
  const [inputYear, setInputYear] = useState("");
  const [spatialBins, setSpatialBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch spatial bins from backend
  useEffect(() => {
    const fetchSpatialBins = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/spatial/bins");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSpatialBins(data.bins || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching spatial bins:", error);
        setError("Failed to load spatial bins");
        setLoading(false);
      }
    };

    fetchSpatialBins();
  }, []);

  // Convert spatial bins to forecast data format
  const forecastData = spatialBins.map(bin => ({
    bin: bin.id,
    maxMag: bin.max_magnitude > 0 ? bin.max_magnitude.toFixed(1) : "-",
    noOfEq: bin.historical_earthquake_count || "-"
  }));

  const goBack = () => {
    navigateToPage(3);
  };

  // Fix for default markers
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  });

  // Convert spatial bins to regions format for map display
  const regions = spatialBins.map(bin => ({
    id: bin.id,
    name: bin.name,
    risk: bin.risk_level.toLowerCase(),
    bin: bin.id,
    positions: bin.coordinates,
    regionCode: bin.region_code,
    riskScore: bin.risk_score,
    historicalCount: bin.historical_earthquake_count,
    avgMagnitude: bin.avg_magnitude,
    maxMagnitude: bin.max_magnitude
  }));

  const handleYearSubmit = () => {
    console.log("Generating forecast for year:", inputYear);
  };

  return (
    <div className="forecast-page-container">
      {/* Header */}
      <div className="forecast-page-header">
        <button onClick={goBack} className="forecast-page-back-btn" title="Go back">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="forecast-page-header-content">
          <div className="forecast-page-logo">Earthquake Forecasting</div>
          <div className="forecast-page-nav-menu">
            <button
              onClick={() => navigateToPage(3)}
              className="forecast-page-nav-item"
            >
              Overview
            </button>
            <button
              onClick={() => navigateToPage(5)}
              className="forecast-page-nav-item"
            >
              About
            </button>
            <button
              onClick={() => navigateToPage(6)}
              className="forecast-page-nav-item"
            >
              Hotlines
            </button>
            <button
              onClick={() => navigateToPage(4)}
              className="forecast-page-nav-item"
            >
              Awareness
            </button>
            <button
              onClick={() => navigateToPage(7)}
              className="forecast-page-forecast-btn active"
            >
              Forecast Now
            </button>
            {isLoggedIn && (
              <button
                onClick={() => navigateToPage(2)}
                className="forecast-page-admin-btn"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="forecast-page-content">
        {/* Sidebar */}
        <div className="forecast-page-sidebar">
          <div className="forecast-page-input-section">
            <label className="forecast-page-input-label">Input Year</label>
            <input
              type="number"
              value={inputYear}
              onChange={(e) => setInputYear(e.target.value)}
              className="forecast-page-year-input"
              placeholder="Enter year"
            />
          </div>

          <div className="forecast-page-table-section">
            <h3 className="forecast-page-table-title">
              Quadtree Spatial Bins ({spatialBins.length} total)
            </h3>
            
            {loading && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Loading spatial bins...
              </div>
            )}
            
            {error && (
              <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                {error}
              </div>
            )}
            
            {!loading && !error && (
              <table className="forecast-page-table">
                <thead>
                  <tr>
                    <th>BIN ID</th>
                    <th>MAX MAG.</th>
                    <th>NO. OF EQ</th>
                    <th>RISK</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.map((row, index) => (
                    <tr key={index}>
                      <td>BIN {row.bin}</td>
                      <td>{row.maxMag}</td>
                      <td>{row.noOfEq}</td>
                      <td>{spatialBins[index]?.risk_level || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Main Map Area */}
        <div className="forecast-page-map-area">
          <div className="forecast-page-map-container">
            <MapContainer
              center={[12.8797, 121.774]}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
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
                    fillColor: 'transparent',
                    fillOpacity: 0,
                    color: '#2563eb',
                    weight: 2,
                    opacity: 0.8
                  }}
                >
                  <Tooltip 
                    permanent={false}
                    direction="top"
                    offset={[0, -10]}
                    opacity={0.9}
                    className="bin-tooltip"
                  >
                    <div style={{ 
                      minWidth: '200px', 
                      fontSize: '12px',
                      lineHeight: '1.4'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {region.name}
                      </div>
                      <div><strong>BIN ID:</strong> {region.bin}</div>
                      <div><strong>Region Code:</strong> {region.regionCode}</div>
                      <div><strong>Risk Level:</strong> {region.risk}</div>
                      <div><strong>Risk Score:</strong> {region.riskScore}</div>
                      <div><strong>Historical Earthquakes:</strong> {region.historicalCount}</div>
                      <div><strong>Avg Magnitude:</strong> {region.avgMagnitude > 0 ? region.avgMagnitude.toFixed(2) : 'N/A'}</div>
                      <div><strong>Max Magnitude:</strong> {region.maxMagnitude > 0 ? region.maxMagnitude.toFixed(2) : 'N/A'}</div>
                    </div>
                  </Tooltip>
                </Polygon>
              ))}
            </MapContainer>
          </div>

          <div className="forecast-page-disclaimer">
            Disclaimer: For informational and research purposes only
          </div>
        </div>
      </div>
    </div>
  );
};

async function getPrediction(input) {
  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input), // e.g. { latitude, longitude, depth, year }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Predicted magnitude:", data.predicted_magnitude);
    return data.predicted_magnitude;
  } catch (error) {
    console.error("Error fetching prediction:", error);
  }
}

export default ForecastPage;