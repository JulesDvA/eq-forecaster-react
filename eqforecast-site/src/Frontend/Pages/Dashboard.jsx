import React, { useState } from "react";
import "../Css/Dashboard.css";

const Dashboard = ({ navigateToPage }) => {
  const [earthquakeData, setEarthquakeData] = useState([
    {
      id: 1,
      date: "2024-01-15",
      magnitude: 5.2,
      location: "Luzon",
      depth: 10,
      latitude: 15.2,
      longitude: 120.5,
    },
    {
      id: 2,
      date: "2024-01-18",
      magnitude: 4.8,
      location: "Mindanao",
      depth: 25,
      latitude: 7.5,
      longitude: 125.2,
    },
    {
      id: 3,
      date: "2024-01-22",
      magnitude: 6.1,
      location: "Central Luzon",
      depth: 15,
      latitude: 15.8,
      longitude: 121.0,
    },
  ]);

  const [newEntry, setNewEntry] = useState({
    date: "",
    magnitude: "",
    location: "",
    depth: "",
    latitude: "",
    longitude: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const addEarthquakeEntry = (e) => {
    e.preventDefault();
    if (Object.values(newEntry).every((value) => value !== "")) {
      const newId = Math.max(...earthquakeData.map((item) => item.id)) + 1;
      setEarthquakeData([
        ...earthquakeData,
        {
          ...newEntry,
          id: newId,
          magnitude: parseFloat(newEntry.magnitude),
          depth: parseFloat(newEntry.depth),
        },
      ]);
      setNewEntry({
        date: "",
        magnitude: "",
        location: "",
        depth: "",
        latitude: "",
        longitude: "",
      });
    }
  };

  const deleteEntry = (id) => {
    setEarthquakeData(earthquakeData.filter((item) => item.id !== id));
  };

  const logout = () => {
    navigateToPage(1);
  };

  const goBack = () => {
    navigateToPage(3);
  };

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
            </div>
            <button type="submit" className="dashboard-add-btn">
              Add Entry
            </button>
          </form>
        </div>

        {/* Database Table */}
        <div className="dashboard-table-container">
          <h3 className="dashboard-subsection-title">
            Current Database Entries
          </h3>
          <div className="dashboard-table-wrapper">
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {earthquakeData.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>{entry.date}</td>
                    <td>{entry.magnitude}</td>
                    <td>{entry.location}</td>
                    <td>{entry.depth}</td>
                    <td>{entry.latitude}</td>
                    <td>{entry.longitude}</td>
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
          </div>
        </div>

        <div className="dashboard-disclaimer">
          Disclaimer: For informational and research purposes only
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
