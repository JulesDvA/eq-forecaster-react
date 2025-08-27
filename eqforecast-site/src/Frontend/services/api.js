const API_BASE_URL = 'http://localhost:8000';

// API service for connecting to Flask backend
export const apiService = {
  // Spatial bins endpoints
  async getAvailableYears() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/spatial/available-years`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching available years:', error);
      throw error;
    }
  },

  async getSpatialBins(year) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/spatial/bins?year=${year}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching spatial bins:', error);
      throw error;
    }
  },

  // Prediction endpoints
  async generatePredictions(year) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predictions/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year: parseInt(year) }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating predictions:', error);
      throw error;
    }
  },

  async getPredictions(year) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predictions?year=${year}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  },

  // Earthquake data endpoints
  async getEarthquakes(year) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/earthquakes?year=${year}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching earthquakes:', error);
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking backend health:', error);
      throw error;
    }
  }
};

export default apiService;
