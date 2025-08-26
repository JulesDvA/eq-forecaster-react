import React, { useState, useEffect } from "react";
import "../Css/Dashboard.css";
import { 
  addEarthquake, 
  deleteEarthquake, 
  updateEarthquake, 
  subscribeToEarthquakes,
  getEarthquakes
} from "../services/earthquakeService";
import { testSupabaseConnection } from "../supabase";
import { uploadAndProcessCSV } from "../services/csvUploadService";
import { signOut, getCurrentUser } from "../services/authService";

const Dashboard = ({ navigateToPage, onLogout }) => {
  const [earthquakeData, setEarthquakeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [newEntry, setNewEntry] = useState({
    date: "",
    magnitude: "",
    location: "",
    depth: "",
    latitude: "",
    longitude: "",
    description: ""
  });

  // Load initial data and set up real-time subscription
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
          console.error('❌ No authenticated user found');
          navigateToPage(2); // Go back to login
          return;
        }
        
        setCurrentUser(user);
        console.log('✅ User authenticated:', user.email);
        
        const earthquakes = await getEarthquakes();
        setEarthquakeData(earthquakes);
      } catch (error) {
        console.error('❌ Error loading earthquakes:', error);
        setError('Failed to load earthquake data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time subscription
    const unsubscribe = subscribeToEarthquakes((payload) => {
      console.log('🔄 Real-time update:', payload);
      
      if (payload.eventType === 'INSERT') {
        setEarthquakeData(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'DELETE') {
        setEarthquakeData(prev => prev.filter(item => item.id !== payload.old.id));
      } else if (payload.eventType === 'UPDATE') {
        setEarthquakeData(prev => prev.map(item => 
          item.id === payload.new.id ? payload.new : item
        ));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  // Handle CSV file upload
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress('Starting upload...');

    try {
      console.log('📁 Processing CSV file:', file.name);
      setUploadProgress('Uploading to Supabase Storage...');
      
      // Upload and process CSV
      const result = await uploadAndProcessCSV(file);
      
      console.log('✅ CSV processing complete:', result);
      setUploadProgress('Adding earthquake entries to database...');
      
      // Add valid earthquake entries to database
      let addedCount = 0;
      let errorCount = 0;
      
      for (const earthquake of result.data) {
        try {
          await addEarthquake(earthquake);
          addedCount++;
        } catch (error) {
          console.error('❌ Error adding earthquake:', error);
          errorCount++;
        }
      }
      
      // Show results
      const message = `CSV processed successfully!\n\n` +
        `📁 File: ${result.storage.fileName}\n` +
        `📊 Total rows: ${result.parsing.totalRows}\n` +
        `✅ Valid rows: ${result.parsing.validRows}\n` +
        `❌ Error rows: ${result.parsing.errorRows}\n` +
        `💾 Added to database: ${addedCount}\n` +
        `🚫 Database errors: ${errorCount}`;
      
      alert(message);
      
      // Reset file input
      e.target.value = '';
      
    } catch (error) {
      console.error('❌ CSV upload error:', error);
      setError(`CSV upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const addEarthquakeEntry = async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted with data:', newEntry);
    
    // Check required fields
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
          description: ""
        });

        // Show success message
        alert("Earthquake entry added successfully!");
        
      } catch (error) {
        console.error('❌ Error in addEarthquakeEntry:', error);
        setError("Failed to add earthquake entry: " + error.message);
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
        setError("Failed to delete earthquake entry: " + error.message);
        console.error("Error deleting earthquake:", error);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut();
      console.log('✅ Logged out successfully');
      onLogout(); // Use the parent logout handler
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still logout even if signOut fails
      onLogout();
    }
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
          <div className="dashboard-logo">
            ADMIN {currentUser && `(${currentUser.email})`}
          </div>
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

        {/* Test Supabase Connection */}
        <div className="dashboard-form-container">
          <h3 className="dashboard-subsection-title">
            🧪 Test Supabase Connection
          </h3>
          
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
            <button 
              onClick={async () => {
                try {
                  console.log('🧪 Testing Supabase connection...');
                  const isConnected = await testSupabaseConnection();
                  if (isConnected) {
                    alert('✅ Supabase connection successful!');
                  } else {
                    alert('❌ Supabase connection failed. Check your configuration.');
                  }
                } catch (error) {
                  console.error('❌ Test failed:', error);
                  alert('❌ Supabase connection test failed: ' + error.message);
                }
              }}
              style={{ 
                backgroundColor: '#10b981', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🧪 Test Supabase Connection
            </button>
            <span style={{ marginLeft: '10px', fontSize: '14px', color: '#6b7280' }}>
              Click this to test if Supabase is working
            </span>
          </div>
        </div>

        {/* CSV Upload Section */}
        <div className="dashboard-form-container">
          <h3 className="dashboard-subsection-title">
            📁 Upload CSV File
          </h3>
          
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '8px',
            border: '2px dashed #3b82f6',
            textAlign: 'center'
          }}>
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              style={{ display: 'none' }}
              id="csv-upload"
              disabled={isUploading}
            />
            <label htmlFor="csv-upload" style={{ 
              cursor: isUploading ? 'not-allowed' : 'pointer',
              backgroundColor: isUploading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              display: 'inline-block',
              fontWeight: '500'
            }}>
              {isUploading ? '📤 Processing...' : '📁 Choose CSV File'}
            </label>
            
            {uploadProgress && (
              <p style={{ marginTop: '10px', color: '#3b82f6', fontSize: '14px' }}>
                ⏳ {uploadProgress}
              </p>
            )}
            
            <p style={{ marginTop: '10px', color: '#6b7280', fontSize: '14px' }}>
              Upload a CSV file with earthquake data. Expected columns: date, magnitude, location, depth, latitude, longitude, description
            </p>
            
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e0f2fe', borderRadius: '6px', textAlign: 'left' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#0277bd' }}>📋 CSV Format Example:</p>
              <code style={{ fontSize: '12px', color: '#01579b' }}>
                date,magnitude,location,depth,latitude,longitude,description<br/>
                2024-01-15,5.2,Luzon,10.5,15.2,120.5,Strong earthquake<br/>
                2024-01-16,4.8,Mindanao,8.2,7.1,125.6,Moderate tremor
              </code>
            </div>
          </div>
        </div>

        {/* Add New Entry Form */}
        <div className="dashboard-form-container">
          <h3 className="dashboard-subsection-title">
            Add New Earthquake Entry
          </h3>
          
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
                <p>No earthquake entries found. Add your first entry above or upload a CSV file!</p>
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
                      <td>{entry.id}</td>
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
          <p>Data is stored in Supabase and updates in real-time</p>
          <p>CSV files are uploaded to Supabase Storage and processed automatically</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
