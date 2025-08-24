import React, { useState } from "react";
import "../Css/LoginPage.css";

const LoginPage = ({ navigateToPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login validation logic here
    console.log("Login attempt:", { username, password });
    // Navigate to dashboard on successful login
    navigateToPage(2);
  };

  const handleGuestLogin = () => {
    // Navigate to landing page as guest
    navigateToPage(3);
  };

  return (
    <div className="login-page-container">
      <div className="login-page-content">
        <div className="login-page-form-container">
          <h1 className="login-page-title">Login</h1>

          <form onSubmit={handleLogin} className="login-page-form">
            <div className="login-page-input-group">
              <label className="login-page-input-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-page-input"
                placeholder="Enter username"
              />
            </div>

            <div className="login-page-input-group">
              <label className="login-page-input-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-page-input"
                placeholder="Enter password"
              />
            </div>

            <button type="submit" className="login-page-login-btn">
              Login
            </button>
          </form>

          <button onClick={handleGuestLogin} className="login-page-guest-btn">
            Use as guest
          </button>
        </div>

        <div className="login-page-disclaimer">
          Disclaimer: For informational and research purposes only
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
