import React from "react";
import "../Css/HotlinePage.css";

const HotlinePage = ({ navigateToPage, isLoggedIn }) => {
  const goBack = () => {
    navigateToPage(3);
  };

  return (
    <div className="hotline-page-container">
      {/* Header */}
      <div className="hotline-page-header">
        <button
          onClick={goBack}
          className="hotline-page-back-btn"
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

        <div className="hotline-page-header-content">
          <div className="hotline-page-logo"> </div>
          <div className="hotline-page-nav-menu">
            <button
              onClick={() => navigateToPage(3)}
              className="hotline-page-nav-item"
            >
              Overview
            </button>
            <button
              onClick={() => navigateToPage(5)}
              className="hotline-page-nav-item"
            >
              About
            </button>
            <button
              onClick={() => navigateToPage(6)}
              className="hotline-page-nav-item active"
            >
              Hotlines
            </button>
            <button
              onClick={() => navigateToPage(4)}
              className="hotline-page-nav-item"
            >
              Awareness
            </button>
            <button
              onClick={() => navigateToPage(7)}
              className="hotline-page-forecast-btn"
            >
              Forecast Now
            </button>
            {isLoggedIn && (
              <button
                onClick={() => navigateToPage(2)}
                className="hotline-page-admin-btn"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="hotline-page-main">
        <div className="hotline-page-content">
          <h1 className="hotline-page-title">EMERGENCY HOTLINES</h1>

          <div className="hotline-page-list">
            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-category">
                  National Disaster and Risk Reduction and Management Council
                  (NDRRMC) hotlines:
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">
                  (02) 911-1406, (02) 912-2665, (02) 912-5668, (02) 911-1873
                </p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  NDRRMC hotlines for Luzon
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <div className="hotline-page-entries">
                  <p className="hotline-page-entry">
                    National Capital Region: (02) 421-1918
                  </p>
                  <p className="hotline-page-entry">Region I: (072) 607-6528</p>
                  <p className="hotline-page-entry">
                    Region II: (078) 844-1630
                  </p>
                  <p className="hotline-page-entry">
                    Region III: (045) 455-1145
                  </p>
                  <p className="hotline-page-entry">
                    Region IV-A: (049) 531-7266
                  </p>
                  <p className="hotline-page-entry">
                    Region IV-B: (043) 723-4248
                  </p>
                  <p className="hotline-page-entry">
                    Region V: (052) 481-1656, (052) 481-5031
                  </p>
                  <p className="hotline-page-entry">
                    Cordillera Administrative Region: (074) 304-2256, (074)
                    619-0986
                  </p>
                </div>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Office of the Civil Defense regional office telephone
                  directory
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <div className="hotline-page-entries">
                  <p className="hotline-page-entry">
                    National Capital Region: (02) 913-2786
                  </p>
                  <p className="hotline-page-entry">
                    Region I: (072) 607-6528, 700-4747
                  </p>
                  <p className="hotline-page-entry">
                    Region II: (078) 844-1630
                  </p>
                  <p className="hotline-page-entry">
                    Region III: (045) 455-1145
                  </p>
                  <p className="hotline-page-entry">
                    Region IV-A: (049) 834-4244, 531-7279
                  </p>
                  <p className="hotline-page-entry">
                    Region IV-B: (043) 723-4248
                  </p>
                  <p className="hotline-page-entry">Region V: (052) 481-1656</p>
                  <p className="hotline-page-entry">
                    Region VI: (033) 337-6671, 509-7971;
                  </p>
                  <p className="hotline-page-entry">
                    Region VII: (032) 416-5025, 416-5025
                  </p>
                  <p className="hotline-page-entry">
                    Region VIII: (053) 323-8453
                  </p>
                  <p className="hotline-page-entry">
                    Region IX: (062) 215-3984
                  </p>
                  <p className="hotline-page-entry">
                    Region X: (088) 857-3958, 875-3907
                  </p>
                  <p className="hotline-page-entry">
                    Region XI: (082) 233-2022, 233-0611
                  </p>
                  <p className="hotline-page-entry">
                    Region XII: (083) 552-9759; 553-2944
                  </p>
                  <p className="hotline-page-entry">
                    Cordillera Administrative Region: (074) 304-2256
                  </p>
                  <p className="hotline-page-entry">
                    CARAGA: (085) 815-6345, 342-8753, 341-8629
                  </p>
                </div>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Philippine National Police (PNP) Hotline Patrol
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">
                  117 or send TXT PNP to 2920
                </p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Bureau of Fire Protection (NCR)
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">
                  117, (02) 729-5166, (02) 410-6319 (Regional Director,
                  Information Desk)
                </p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Department of Transportation and Communications (DOTC) hotline
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">7890 or (02) 726-6255</p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Metro Manila Development Authority (MMDA)
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <div className="hotline-page-entries">
                  <p className="hotline-page-entry">
                    136; 882-0925 (flood control)
                  </p>
                  <p className="hotline-page-entry">
                    Trunkline: (02) 882-4150-77 loc. 337 (rescue), 255
                    (Metrobase)
                  </p>
                  <p className="hotline-page-entry">Metrobase: 882-0860</p>
                </div>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Department of Public Works and Highways (DPWH)
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">
                  (02) 304-3713, (02) 304-3904
                </p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">Red Cross hotline</h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">
                  143, (02) 527-0000, (02) 527-8385 to 95
                </p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  North Luzon Expressway (NLEX) hotlines
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">
                  (02) 3-5000 and (02) 580-8910; Twitter: @NLEXtraffic
                </p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Subic-Clark-Tarlac Expressway (SCTEX) hotlines
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">
                  (0920) 95-SCTEX (72839) (traffic hotline) or (045) 459-0522
                </p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Skyway System Hotline
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <div className="hotline-page-entries">
                  <p className="hotline-page-entry">
                    (02) 776-7777 (PLDT), 0917-539-8762 (globe), 0999-888-0893
                    (smart), 0932-854-6980 (sun);
                  </p>
                  <p className="hotline-page-entry">Twitter: @SkywayOMCO</p>
                </div>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  South Luzon Expressway (SLEX) hotline
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">
                  0917-587-7339 (globe), (049) 508-7509, (02) 584-4389
                </p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Philippine Atmospheric, Geophysical and Astronomical Services
                  Administration (PAGASA) hotline
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">(02) 433-8526</p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Philippine Coast Guard
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">
                  (02) 527-3877, (02) 527-8481, 0917-724-3682 (globe),
                  0917-PCG-DOTC (globe)
                </p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Manila Water Hotline
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">1627</p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">PHIVOLCS</h2>
              </div>
              <div className="hotline-page-section-content">
                <div className="hotline-page-entries">
                  <p className="hotline-page-entry">
                    Trunkline: (02) 426-1468 to 79, local 124/125 (emergency);
                  </p>
                  <p className="hotline-page-entry">
                    426-1468; 0905-313-4077 (globe)
                  </p>
                </div>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">
                  Manila Tollway Express Systems (MATES):
                </h2>
              </div>
              <div className="hotline-page-section-content">
                <p className="hotline-page-numbers">
                  (049)5087539; (0908)8807539
                </p>
              </div>
            </div>

            <div className="hotline-page-section">
              <div className="hotline-page-section-header">
                <h2 className="hotline-page-subcategory">DSWD</h2>
              </div>
              <div className="hotline-page-section-content">
                <div className="hotline-page-entries">
                  <p className="hotline-page-entry">(02) 951-7119</p>
                  <p className="hotline-page-entry">
                    Disaster Response Unit: (632)931-81-01 to 07, local 426
                  </p>
                  <p className="hotline-page-entry">
                    Earthquake text hotlines: For Globe and Touch Mobile users,
                    text "IREPORT&lt;space&gt;name/location/message" to 2327 or
                    09178902327. For Smart, Sun and Talk N' Text users, text
                    concerns to 09189122813.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="hotline-page-bottom-cta">
            <h2 className="hotline-page-cta-title">
              Want to try the forecasting model?
            </h2>
            <p className="hotline-page-cta-subtitle">
              Regional Earthquake Forecasting in the PH Modelling
              Attention-Driven LSTM
            </p>
            <button
              onClick={() => navigateToPage(7)}
              className="hotline-page-cta-btn"
            >
              Forecast Now
            </button>
          </div>

          <div className="hotline-page-disclaimer">
            Disclaimer: For informational and research purposes only
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotlinePage;
