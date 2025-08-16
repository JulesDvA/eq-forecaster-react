import React, { useState } from "react";
import LandingPage from "./LandingPage/LandingPage";
import AboutPage from "./AboutPage/AboutPage";
import HotlinePage from "./HotlinePage/HotlinePage";
import AwarenessPage from "./AwarenessPage/AwarenessPage";
import ForecastPage from "./ForecastingPage/ForecastingPage";
const App = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {currentPage === 1 && <LandingPage navigateToPage={navigateToPage} />}
      {currentPage === 2 && <AwarenessPage navigateToPage={navigateToPage} />}
      {currentPage === 3 && <AboutPage navigateToPage={navigateToPage} />}
      {currentPage === 4 && <HotlinePage navigateToPage={navigateToPage} />}
      {currentPage === 5 && <ForecastPage navigateToPage={navigateToPage} />}

    </div>
  );
};

export default App;
