import React from "react";
import "./LandingPage.css";

const LandingPage = ({ navigateToPage }) => {
  return (
    <div className="landing-page-container">
      {/* Header */}
      <div className="landing-page-header">
        <div className="landing-page-header-content">
          <div className="landing-page-logo">OPAL</div>
          <div className="landing-page-nav-menu">
            <button
              onClick={() => navigateToPage(1)}
              className="landing-page-nav-item active"
            >
              Overview
            </button>
            <button
              onClick={() => navigateToPage(3)}
              className="landing-page-nav-item"
            >
              About
            </button>
            <button
              onClick={() => navigateToPage(4)}
              className="landing-page-nav-item"
            >
              Hotlines
            </button>
            <button
              onClick={() => navigateToPage(2)}
              className="landing-page-nav-item"
            >
              Awareness
            </button>
            <button
              onClick={() => navigateToPage(5)}
              className="landing-page-forecast-btn"
            >
              Forecast Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="landing-page-hero-section">
        <h1 className="landing-page-hero-title">OPAL Earthquake Forecasting</h1>
        <p className="landing-page-hero-subtitle">
          Regional Earthquake Forecasting in the PH Modelling Attention-Driven
          LSTM
        </p>
        <button
          onClick={() => navigateToPage(5)}
          className="landing-page-hero-cta-btn"
        >
          Forecast Now
        </button>
      </div>

      {/* Map Section */}
      <div className="landing-page-map-section">
        <div className="landing-page-map-container">
          <img
            src="/api/placeholder/1200/400"
            alt="Philippines Map"
            className="landing-page-map-image"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="landing-page-content-section">
        <div className="landing-page-content-grid">
          <div className="landing-page-content-text">
            <h2 className="landing-page-content-title">
              Earthquake Forecasting
            </h2>
            <p className="landing-page-content-paragraph">
              Body text for your whole article or post. We'll put in some lorem
              ipsum to show how a filled-out page might look.
            </p>
            <p className="landing-page-content-paragraph">
              Excepteur efficient emerging, minim veniam anim aute carefully
              curated Ginza conversation exquisite perfect nostrud nisi
              intricate Content. Qui international first-class nulla ut.
              Punctual adipiscing, essential lovely queen tempor eiusmod irure.
              Exclusive izakaya charming Scandinavian impeccable aute quality of
              life soft power pariatur Melbourne consectetur discerning. Qui
              wardrobe aliquip, et Porter destination Toto remarkable officia
              Helsinki excepteur Basset hound. ZÃ¼rich sleepy perfect
              consectetur.
            </p>
          </div>
          <div className="landing-page-content-image-container">
            <img
              src="/api/placeholder/400/250"
              alt="Earthquake visualization"
              className="landing-page-content-image"
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="landing-page-bottom-cta">
        <h2 className="landing-page-cta-title">
          Want to know more about the model?
        </h2>
        <p className="landing-page-cta-subtitle">
          Regional Earthquake Forecasting in the PH Modelling Attention-Driven
          LSTM
        </p>
        <div className="landing-page-cta-buttons">
          <button
            onClick={() => navigateToPage(3)}
            className="landing-page-cta-btn-secondary"
          >
            About
          </button>
          <button
            onClick={() => navigateToPage(5)}
            className="landing-page-cta-btn-primary"
          >
            Forecast Now
          </button>
        </div>
      </div>
      <div className="landing-page-disclaimer">
        Disclaimer: For informational and research purposes only
      </div>
    </div>
  );
};

export default LandingPage;
