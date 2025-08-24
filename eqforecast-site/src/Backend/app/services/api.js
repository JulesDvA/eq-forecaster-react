/**
 * API service for connecting to the FastAPI backend
 */

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async checkHealth() {
    return this.makeRequest('/health');
  }

  // Get API status
  async getApiStatus() {
    return this.makeRequest('/api/status');
  }

  // Get Philippine regions
  async getRegions() {
    return this.makeRequest('/api/regions');
  }

  // Get earthquake data with filters
  async getEarthquakes(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const endpoint = `/api/earthquakes${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Get earthquake statistics
  async getStatistics(region = null) {
    const params = region ? `?region=${encodeURIComponent(region)}` : '';
    return this.makeRequest(`/api/statistics${params}`);
  }

  // Make earthquake prediction
  async predictEarthquake(predictionRequest) {
    return this.makeRequest('/api/predict', {
      method: 'POST',
      body: JSON.stringify(predictionRequest),
    });
  }

  // Get ML model information
  async getModelInfo() {
    return this.makeRequest('/api/model-info');
  }

  // Utility method to format earthquake data for display
  formatEarthquakeData(earthquakes) {
    return earthquakes.map(eq => ({
      ...eq,
      formattedDate: new Date(eq.timestamp).toLocaleString(),
      magnitudeColor: this.getMagnitudeColor(eq.magnitude),
      riskLevel: this.getRiskLevel(eq.magnitude),
    }));
  }

  // Get color based on magnitude
  getMagnitudeColor(magnitude) {
    if (magnitude >= 6.0) return '#dc2626'; // red
    if (magnitude >= 5.0) return '#ea580c'; // orange
    if (magnitude >= 4.0) return '#d97706'; // amber
    if (magnitude >= 3.0) return '#eab308'; // yellow
    return '#22c55e'; // green
  }

  // Get risk level based on magnitude
  getRiskLevel(magnitude) {
    if (magnitude >= 6.0) return 'High';
    if (magnitude >= 5.0) return 'Moderate';
    if (magnitude >= 4.0) return 'Low';
    return 'Minimal';
  }

  // Format region data for display
  formatRegionData(regions) {
    return regions.map(region => ({
      ...region,
      lastEarthquakeFormatted: region.last_earthquake 
        ? new Date(region.last_earthquake).toLocaleDateString()
        : 'No recent data',
      riskColor: this.getMagnitudeColor(region.avg_magnitude),
    }));
  }

  // Get earthquake forecast regions (for map display)
  getForecastRegions() {
    return [
      {
        name: 'NCR',
        displayName: 'National Capital Region',
        color: '#dc2626',
        positions: [
          [14.7608, 120.9020],
          [14.7608, 121.1150],
          [14.4777, 121.1150],
          [14.4777, 120.9020]
        ]
      },
      {
        name: 'CAR',
        displayName: 'Cordillera Administrative Region',
        color: '#22c55e',
        positions: [
          [18.0, 120.0],
          [18.0, 122.0],
          [16.0, 122.0],
          [16.0, 120.0]
        ]
      },
      {
        name: 'Region IV-A',
        displayName: 'CALABARZON',
        color: '#ea580c',
        positions: [
          [14.8, 120.5],
          [14.8, 122.0],
          [13.0, 122.0],
          [13.0, 120.5]
        ]
      },
      {
        name: 'Region VII',
        displayName: 'Central Visayas',
        color: '#9333ea',
        positions: [
          [11.5, 123.0],
          [11.5, 125.0],
          [9.0, 125.0],
          [9.0, 123.0]
        ]
      },
      {
        name: 'Region VIII',
        displayName: 'Eastern Visayas',
        color: '#d97706',
        positions: [
          [12.5, 124.0],
          [12.5, 126.0],
          [10.0, 126.0],
          [10.0, 124.0]
        ]
      }
    ];
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
