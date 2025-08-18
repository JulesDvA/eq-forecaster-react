import React from "react";
import "../Css/AboutPage.css";

const AboutPage = ({ navigateToPage }) => {
  return (
    <div className="about-page-container">
      {/* Header */}
      <div className="about-page-header">
        <div className="about-page-header-content">
          <div className="about-page-logo">OPAL</div>
          <div className="about-page-nav-menu">
            <button
              onClick={() => navigateToPage(1)}
              className="about-page-nav-item"
            >
              Overview
            </button>
            <button
              onClick={() => navigateToPage(3)}
              className="about-page-nav-item active"
            >
              About
            </button>
            <button
              onClick={() => navigateToPage(4)}
              className="about-page-nav-item"
            >
              Hotlines
            </button>
            <button
              onClick={() => navigateToPage(2)}
              className="about-page-nav-item"
            >
              Awareness
            </button>
            <button
              onClick={() => navigateToPage(5)}
              className="about-page-forecast-btn"
            >
              Forecast Now
            </button>
          </div>
        </div>
      </div>

      <div className="about-page-main-content">
        {/* About the model section */}
        <h1 className="about-page-title">About the model...</h1>

        <div className="about-page-model-section">
          <div className="about-page-model-content">
            <div className="about-page-model-text">
              <h2 className="about-page-section-title">
                Earthquake Forecasting
              </h2>
              <p className="about-page-section-paragraph">
                Body text for your whole article or post. We'll put in some
                lorem ipsum to show how a filled-out page might look.
              </p>
              <p className="about-page-section-paragraph">
                Excepteur efficient emerging, minim veniam anim aute carefully
                curated Ginza conversation exquisite perfect nostrud nisi
                intricate Content. Qui international first-class nulla ut.
                Punctual adipiscing, essential lovely queen tempor eiusmod
                irure. Exclusive izakaya charming Scandinavian impeccable aute
                quality of life soft power pariatur Melbourne consectetur
                discerning. Qui wardrobe aliquip, et Porter destination Toto
                remarkable officia Helsinki excepteur Basset hound. ZÃ¼rich
                sleepy perfect consectetur.
              </p>

              <h2 className="about-page-section-title">
                Rule-Based Classification Algorithm
              </h2>
              <p className="about-page-section-paragraph">
                Body text for your whole article or post. We'll put in some
                lorem ipsum to show how a filled-out page might look.
              </p>
              <p className="about-page-section-paragraph">
                Excepteur efficient emerging, minim veniam anim aute carefully
                curated Ginza conversation exquisite perfect nostrud nisi
                intricate Content. Qui international first-class nulla ut.
                Punctual adipiscing, essential lovely queen tempor eiusmod
                irure. Exclusive izakaya charming Scandinavian impeccable aute
                quality of life soft power pariatur Melbourne consectetur
                discerning. Qui wardrobe aliquip, et Porter destination Toto
                remarkable officia Helsinki excepteur Basset hound. ZÃ¼rich
                sleepy perfect consectetur.
              </p>

              <h2 className="about-page-section-title">
                Spatio-temporal Forecasting Concept
              </h2>
              <p className="about-page-section-paragraph">
                Body text for your whole article or post. We'll put in some
                lorem ipsum to show how a filled-out page might look.
              </p>
              <p className="about-page-section-paragraph">
                Excepteur efficient emerging, minim veniam anim aute carefully
                curated Ginza conversation exquisite perfect nostrud nisi
                intricate Content. Qui international first-class nulla ut.
                Punctual adipiscing, essential lovely queen tempor eiusmod
                irure. Exclusive izakaya charming Scandinavian impeccable aute
                quality of life soft power pariatur Melbourne consectetur
                discerning. Qui wardrobe aliquip, et Porter destination Toto
                remarkable officia Helsinki excepteur Basset hound. ZÃ¼rich
                sleepy perfect consectetur.
              </p>
            </div>

            <div className="about-page-model-image-container">
              <img
                src="/api/placeholder/500/400"
                alt="Model diagram"
                className="about-page-model-image"
              />
            </div>
          </div>
        </div>

        {/* About the team section */}
        <div className="about-page-team-section">
          <div className="about-page-team-content">
            <h2 className="about-page-team-main-title">About the team...</h2>

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
                  remarkable officia Helsinki excepteur Basset hound. ZÃ¼rich
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
