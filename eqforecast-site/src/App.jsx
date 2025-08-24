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

  const navigateToPage = (page) => {
    // Set logged in status when navigating to dashboard
    if (page === 2) {
      setIsLoggedIn(true);
    }
    // Set logged out when going back to login
    if (page === 1) {
      setIsLoggedIn(false);
    }
    setCurrentPage(page);
  };

  return (
    <div>
      {currentPage === 1 && <LoginPage navigateToPage={navigateToPage} />}
      {currentPage === 2 && <Dashboard navigateToPage={navigateToPage} />}
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
