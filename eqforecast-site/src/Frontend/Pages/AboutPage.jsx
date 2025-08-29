import React from "react";
import "../Css/AboutPage.css";
import model from "../Pics/model.png";

const AboutPage = ({ navigateToPage, isLoggedIn }) => {
  const goBack = () => {
    // Navigate to the previous page or landing page
    navigateToPage(3);
  };

  return (
    <div className="about-page-container">
      {/* Header */}
      <div className="about-page-header">
        <button
          onClick={goBack}
          className="about-page-back-btn"
          title="Go back"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="about-page-header-content">
          <div className="about-page-logo"></div>
          <div className="about-page-nav-menu">
            <button
              onClick={() => navigateToPage(3)}
              className="about-page-nav-item"
            >
              Overview
            </button>
            <button
              onClick={() => navigateToPage(5)}
              className="about-page-nav-item active"
            >
              About
            </button>
            <button
              onClick={() => navigateToPage(6)}
              className="about-page-nav-item"
            >
              Hotlines
            </button>
            <button
              onClick={() => navigateToPage(4)}
              className="about-page-nav-item"
            >
              Awareness
            </button>
            <button
              onClick={() => navigateToPage(7)}
              className="about-page-forecast-btn"
            >
              Forecast Now
            </button>
            {isLoggedIn && (
              <button
                onClick={() => navigateToPage(2)}
                className="about-page-admin-btn"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="about-page-main-content">
        {/* About the model section */}
        <h1 className="about-page-title">About the model</h1>

        <div className="about-page-model-section">
          <div className="about-page-model-content">
            <div className="about-page-model-text">
              <h2 className="about-page-section-title">
                Earthquake Forecasting
              </h2>
              <p className="about-page-section-paragraph">
                Earthquake forecasting looks at past earthquake records to find
                patterns that can help us understand future risks. While it
                cannot predict the exact time or place of the next quake, it can
                show which areas are more likely to experience stronger or more
                frequent earthquakes.
              </p>
              <p className="about-page-section-paragraph">
                These forecasts give communities, leaders, and disaster agencies
                useful information to prepare better, strengthen safety plans,
                and reduce the damage caused by future quakes.
              </p>

              <h2 className="about-page-section-title">
                Rule-Based Classification Algorithm
              </h2>
              <p className="about-page-section-paragraph">
                To make earthquake data easier to understand, we use a
                rule-based system that groups earthquakes based on where they
                happen. Instead of using political or city boundaries, the
                system divides areas using their actual earthquake activity.
              </p>
              <p className="about-page-section-paragraph">
                This makes it possible to identify high-risk zones more
                accurately, helping disaster planners and communities focus on
                the areas that need the most attention.
              </p>

              <h2 className="about-page-section-title">
                Spatio-temporal Forecasting Concept
              </h2>
              <p className="about-page-section-paragraph">
                Spatio-temporal forecasting means looking at earthquakes in both
                time (when they happen) and space (where they happen). By
                combining these two factors, we can see trends in how
                earthquakes affect different regions over the years.
              </p>
              <p className="about-page-section-paragraph">
                This approach uses modern tools to give a clearer picture of
                which areas are at higher risk in the future. The goal is to
                provide easy-to-understand forecasts that help people,
                communities, and decision-makers stay safer and more prepared.
              </p>
            </div>

            <div className="about-page-model-image-container">
              <img
                src={model}
                alt="Model diagram"
                className="about-page-model-image"
              />
            </div>
          </div>
        </div>

        {/* About the team section */}
        <div className="about-page-team-section">
          <div className="about-page-team-content">
            <h2 className="about-page-team-main-title">About the team</h2>

            <div className="about-page-team-intro">
              <div className="about-page-team-image-container">
                <img
                  src="/api/placeholder/400/250"
                  alt="Team photo"
                  className="about-page-team-image"
                />
              </div>
              <div className="about-page-team-description">
                <h3 className="about-page-team-section-title">
                  Earthquake Forecasting
                </h3>
                <p className="about-page-team-paragraph">
                  Body text for your whole article or post. We'll put in some
                  lorem ipsum to show how a filled-out page might look.
                </p>
                <p className="about-page-team-paragraph">
                  Excepteur efficient emerging, minim veniam anim aute carefully
                  curated Ginza conversation exquisite perfect nostrud nisi
                  intricate Content. Qui international first-class nulla ut.
                  Punctual adipiscing, essential lovely queen tempor eiusmod
                  irure. Exclusive izakaya charming Scandinavian impeccable aute
                  quality of life soft power pariatur Melbourne consectetur
                  discerning. Qui wardrobe aliquip, et Porter destination Toto
                  remarkable officia Helsinki excepteur Basset hound. Zürich
                  sleepy perfect consectetur.
                </p>
              </div>
            </div>

            <h3 className="about-page-team-members-title">
              Meet the team behind OPAL
            </h3>

            <div className="about-page-team-members-grid">
              <div className="about-page-team-member-card">
                <div className="about-page-member-image-container">
                  <img
                    src="/api/placeholder/80/80"
                    alt="Julia Abasolo"
                    className="about-page-member-image"
                  />
                </div>
                <div className="about-page-member-info">
                  <h4 className="about-page-member-name">Abasolo, Julia</h4>
                  <p className="about-page-member-description">
                    Body text for whatever you'd like to say. Add main takeaway
                    points, quotes, anecdotes, or even a very very short story.
                  </p>
                </div>
              </div>

              <div className="about-page-team-member-card">
                <div className="about-page-member-image-container">
                  <img
                    src="/api/placeholder/80/80"
                    alt="Kiara Laxamana"
                    className="about-page-member-image"
                  />
                </div>
                <div className="about-page-member-info">
                  <h4 className="about-page-member-name">Laxamana, Kiara</h4>
                  <p className="about-page-member-description">
                    Body text for whatever you'd like to say. Add main takeaway
                    points, quotes, anecdotes, or even a very very short story.
                  </p>
                </div>
              </div>

              <div className="about-page-team-member-card">
                <div className="about-page-member-image-container">
                  <img
                    src="/api/placeholder/80/80"
                    alt="Gabriel Ocampo"
                    className="about-page-member-image"
                  />
                </div>
                <div className="about-page-member-info">
                  <h4 className="about-page-member-name">Ocampo, Gabriel</h4>
                  <p className="about-page-member-description">
                    Body text for whatever you'd like to say. Add main takeaway
                    points, quotes, anecdotes, or even a very very short story.
                  </p>
                </div>
              </div>

              <div className="about-page-team-member-card">
                <div className="about-page-member-image-container">
                  <img
                    src="/api/placeholder/80/80"
                    alt="Joshua Perez"
                    className="about-page-member-image"
                  />
                </div>
                <div className="about-page-member-info">
                  <h4 className="about-page-member-name">Perez, Joshua</h4>
                  <p className="about-page-member-description">
                    Body text for whatever you'd like to say. Add main takeaway
                    points, quotes, anecdotes, or even a very very short story.
                  </p>
                </div>
              </div>
            </div>

            <div className="about-page-team-disclaimer">
              Disclaimer: For informational and research purposes only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
