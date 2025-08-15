import React, { useState } from "react";
import LandingPage from "./LandingPage/LandingPage";
import AboutPage from "./AboutPage/AboutPage";
import HotlinePage from "./HotlinePage/HotlinePage";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {currentPage === 1 && <LandingPage navigateToPage={navigateToPage} />}
      {currentPage === 3 && <AboutPage navigateToPage={navigateToPage} />}
      {currentPage === 4 && <HotlinePage navigateToPage={navigateToPage} />}
    </div>
  );
};

export default App;
