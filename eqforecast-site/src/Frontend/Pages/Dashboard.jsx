import React, { useState, useEffect } from "react";
import "../Css/Dashboard.css";
import { 
  addEarthquake, 
  deleteEarthquake, 
  updateEarthquake, 
  subscribeToEarthquakes 
} from "../services/earthquakeService";

const Dashboard = ({ navigateToPage }) => {
  const [earthquakeData, setEarthquakeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newEntry, setNewEntry] = useState({
    date: "",
    magnitude: "",
    location: "",
    depth: "",
    latitude: "",
    longitude: "",
    description: "",
    source: "manual_entry"
  });

  // Real-time data subscription
  useEffect(() => {
    const unsubscribe = subscribeToEarthquakes((earthquakes) => {
      setEarthquakeData(earthquakes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const addEarthquakeEntry = async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted with data:', newEntry);
    
    // Check only required fields (excluding description which is optional)
    const requiredFields = ['date', 'magnitude', 'location', 'depth', 'latitude', 'longitude'];
    const hasAllRequired = requiredFields.every(field => newEntry[field] !== "");
    
    if (hasAllRequired) {
      console.log('✅ All required fields filled, proceeding...');
      setIsSubmitting(true);
      setError(null);
      
      try {
        const earthquakeData = {
          ...newEntry,
          magnitude: parseFloat(newEntry.magnitude),
          depth: parseFloat(newEntry.depth),
          latitude: parseFloat(newEntry.latitude),
          longitude: parseFloat(newEntry.longitude),
          timestamp: new Date(newEntry.date).toISOString()
        };

        console.log('🚀 Calling addEarthquake service with:', earthquakeData);
        await addEarthquake(earthquakeData);
        
        console.log('✅ Earthquake added successfully, resetting form...');
        // Reset form
        setNewEntry({
          date: "",
          magnitude: "",
          location: "",
          depth: "",
          latitude: "",
          longitude: "",
          description: "",
          source: "manual_entry"
        });

        // Show success message
        alert("Earthquake entry added successfully!");
        
      } catch (error) {
        console.error('❌ Error in addEarthquakeEntry:', error);
        setError("Failed to add earthquake entry. Please try again.");
        console.error("Error adding earthquake:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('❌ Some required fields are empty:', newEntry);
      setError("Please fill in all required fields.");
    }
  };

  const deleteEntry = async (id) => {
    if (window.confirm("Are you sure you want to delete this earthquake entry?")) {
      try {
        await deleteEarthquake(id);
        alert("Earthquake entry deleted successfully!");
      } catch (error) {
        setError("Failed to delete earthquake entry. Please try again.");
        console.error("Error deleting earthquake:", error);
      }
    }
  };

  const logout = () => {
    navigateToPage(1);
  };

  const goBack = () => {
    navigateToPage(3);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <h2>Loading earthquake data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <button onClick={goBack} className="dashboard-back-btn" title="Go back">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="dashboard-header-content">
          <div className="dashboard-logo">ADMIN</div>
          <div className="dashboard-nav-menu">
            <button
              onClick={() => navigateToPage(3)}
              className="dashboard-nav-item"
            >
              Overview
            </button>
            <button
              onClick={() => navigateToPage(5)}
              className="dashboard-nav-item"
            >
              About
            </button>
            <button
              onClick={() => navigateToPage(6)}
              className="dashboard-nav-item"
            >
              Hotlines
            </button>
            <button
              onClick={() => navigateToPage(4)}
              className="dashboard-nav-item"
            >
              Awareness
            </button>
            <button
              onClick={() => navigateToPage(7)}
              className="dashboard-forecast-btn"
            >
              Forecast Now
            </button>
            <button onClick={logout} className="dashboard-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-main-content">
        <h2 className="dashboard-section-title">
          Earthquake Database Management
        </h2>

        {/* Error Display */}
        {error && (
          <div className="dashboard-error">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Add New Entry Form */}
        <div className="dashboard-form-container">
          <h3 className="dashboard-subsection-title">
            Add New Earthquake Entry
          </h3>
          
          {/* Test Firebase Connection */}
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
            <button 
              onClick={async () => {
                try {
                  console.log('🧪 Testing Firebase connection...');
                  const testData = { test: true, timestamp: new Date().toISOString() };
                  const result = await addEarthquake(testData);
                  console.log('✅ Test successful:', result);
                  alert('Firebase connection test successful!');
                } catch (error) {
                  console.error('❌ Test failed:', error);
                  alert('Firebase connection test failed: ' + error.message);
                }
              }}
              style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🧪 Test Firebase Connection
            </button>
            <span style={{ marginLeft: '10px', fontSize: '14px', color: '#6b7280' }}>
              Click this to test if Firebase is working
            </span>
          </div>
          
          <form onSubmit={addEarthquakeEntry} className="dashboard-form">
            <div className="dashboard-form-grid">
              <div className="dashboard-input-group">
                <label className="dashboard-input-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newEntry.date}
                  onChange={handleInputChange}
                  className="dashboard-input"
                  required
                />
              </div>
              <div className="dashboard-input-group">
                <label className="dashboard-input-label">Magnitude</label>
                <input
                  type="number"
                  step="0.1"
                  name="magnitude"
                  value={newEntry.magnitude}
                  onChange={handleInputChange}
                  className="dashboard-input"
                  placeholder="5.2"
                  required
                />
              </div>
              <div className="dashboard-input-group">
                <label className="dashboard-input-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={newEntry.location}
                  onChange={handleInputChange}
                  className="dashboard-input"
                  placeholder="Luzon"
                  required
                />
              </div>
              <div className="dashboard-input-group">
                <label className="dashboard-input-label">Depth (km)</label>
                <input
                  type="number"
                  name="depth"
                  value={newEntry.depth}
                  onChange={handleInputChange}
                  className="dashboard-input"
                  placeholder="10"
                  required
                />
              </div>
              <div className="dashboard-input-group">
                <label className="dashboard-input-label">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  name="latitude"
                  value={newEntry.latitude}
                  onChange={handleInputChange}
                  className="dashboard-input"
                  placeholder="15.2"
                  required
                />
              </div>
              <div className="dashboard-input-group">
                <label className="dashboard-input-label">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  name="longitude"
                  value={newEntry.longitude}
                  onChange={handleInputChange}
                  className="dashboard-input"
                  placeholder="120.5"
                  required
                />
              </div>
              <div className="dashboard-input-group">
                <label className="dashboard-input-label">Description (Optional)</label>
                <input
                  type="text"
                  name="description"
                  value={newEntry.description}
                  onChange={handleInputChange}
                  className="dashboard-input"
                  placeholder="Additional details about the earthquake"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="dashboard-add-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Entry"}
            </button>
          </form>
        </div>

        {/* Database Table */}
        <div className="dashboard-table-container">
          <h3 className="dashboard-subsection-title">
            Current Database Entries ({earthquakeData.length} total)
          </h3>
          <div className="dashboard-table-wrapper">
            {earthquakeData.length === 0 ? (
              <div className="dashboard-empty-state">
                <p>No earthquake entries found. Add your first entry above!</p>
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Magnitude</th>
                    <th>Location</th>
                    <th>Depth (km)</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {earthquakeData.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.id.slice(0, 8)}...</td>
                      <td>{entry.date || (entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'N/A')}</td>
                      <td>{entry.magnitude}</td>
                      <td>{entry.location}</td>
                      <td>{entry.depth}</td>
                      <td>{entry.latitude}</td>
                      <td>{entry.longitude}</td>
                      <td>{entry.description || '-'}</td>
                      <td>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="dashboard-delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dashboard-disclaimer">
          <p>Disclaimer: For informational and research purposes only</p>
          <p>Data is stored in Firebase Firestore and updates in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
