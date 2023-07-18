import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './App';
import image2 from "./cssimages/Deckbuilderfunction.png";

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="home-container">
            <div className="hero-section">
              <h1 className="hero-heading">Welcome to Yu-Gi-Oh Deckbuilder!</h1>
              <p className="hero-description">
                Explore the world of Yu-Gi-Oh and become the ultimate duelist. Yu-Gi-Oh Deckbuilder is your ultimate source for everything Yu-Gi-Oh. Create your own deck and track your own personal collection online.
              </p>
              <Link to="/decks" className="explore-button">
                Build A Deck
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="featured-image">
            <img src={image2} style={{ width: '120%', height: '500px' }} alt="Deckbuilder function" />
            <p className="hero-description">Construct decks your favorite characters use throughout the series! </p>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="gallery-container">
            <div className="hero-section">
              <h2 className="hero-heading">Explore Our Gallery</h2>
              <p className="hero-description">
                Check out our extensive collection of Yu-Gi-Oh cards from different series and generations. Featuring over 12,000 cards searchable via name or card description. Whether you're looking for classic cards or the latest releases, we've got you covered.
              </p>
              <Link to="/gallery" className="explore-button">
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home
