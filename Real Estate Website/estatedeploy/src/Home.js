import React from "react";
import "./styles.css";

const Home = () => (
    <div className="home-container">
        <div className="welcome-container">
            <div className="home-text">
                <h1>Welcome to R&G Estates</h1>
                <p>
                    From exclusive estates to high-end urban residences, we offer unparalleled service and access to the finest properties.
                    Elevate your lifestyle with our bespoke real estate solutions, where luxury meets sophistication.
                </p>
            </div>
            <div className="home-image">
                <img src="/real-estate.png" alt="Luxury Real Estate" />
            </div>
        </div>

        <div className="selection-process">
            <div className="selection-process-text">
                <h1>Property Selection Process</h1>
                <p>
                    Our property selection process is designed for efficiency and precision. With advanced search technology and market expertise,
                    we quickly identify the finest properties that match your unique preferences.
                </p>
            </div>
            <div className="selection-process-image">
                <img src="/selection-process.png" alt="Luxury Real Estate" />
            </div>
        </div>

        <div className="location-container">
            <div className="location-text">
                <h2>Where Are We Located?</h2>
                <p>
                    R&G Estates provides a quality, consumer-driven platform for new property buyers.
                    For the first time, prospective buyers will be able to access every listing consisting of
                    New Age Homes or properties with amenities and lifestyle features of the 21st century all in one place.
                </p>
                <p><strong>Address:</strong> R&G Estates, 303 Oxford Street, London, W1C 2JS, United Kingdom</p>
                <p><strong>Phone:</strong> +44 749893115</p>
                <p><strong>Mail:</strong> rgestates@contact.com</p>
            </div>

            {/* Map Image */}
            <div className="map-image">
                <img src="/location.png" alt="R&G Estates Location" />
            </div>
        </div>
    </div>
);

export default Home;
