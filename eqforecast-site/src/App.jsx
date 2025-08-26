import React, { useState } from "react";
import LoginPage from "./Frontend/Pages/LoginPage";
import Dashboard from "./Frontend/Pages/Dashboard";
import LandingPage from "./Frontend/Pages/LandingPage";
import AwarenessPage from "./Frontend/Pages/AwarenessPage";
import AboutPage from "./Frontend/Pages/AboutPage";
import HotlinePage from "./Frontend/Pages/HotlinePage";
import ForecastPage from "./Frontend/Pages/ForecastingPage";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentPage(2); // Go to Dashboard
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentPage(1); // Go back to Landing Page
  };

  return (
    <div>
      {currentPage === 1 && <LoginPage navigateToPage={navigateToPage} onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 2 && <Dashboard navigateToPage={navigateToPage} onLogout={handleLogout} />}
      {currentPage === 3 && (
        <LandingPage navigateToPage={navigateToPage} isLoggedIn={isLoggedIn} />
      )}
      {currentPage === 4 && (
        <AwarenessPage
          navigateToPage={navigateToPage}
          isLoggedIn={isLoggedIn}
        />
      )}
      {currentPage === 5 && (
        <AboutPage navigateToPage={navigateToPage} isLoggedIn={isLoggedIn} />
      )}
      {currentPage === 6 && (
        <HotlinePage navigateToPage={navigateToPage} isLoggedIn={isLoggedIn} />
      )}
      {currentPage === 7 && (
        <ForecastPage navigateToPage={navigateToPage} isLoggedIn={isLoggedIn} />
      )}
    </div>
  );
};

export default App;
