import React, { useState, useEffect, useContext } from 'react'
import LazyLoad from 'react-lazyload'
import { UserContext } from './App'

function Gallery() {
  const { user } = useContext(UserContext)
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);

  const fetchCards = () => {
    fetch('http://127.0.0.1:5555/cards')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched cards:', data);
        setCards(data);
      })
      .catch(error => {
        console.error('Error fetching cards:', error);
      });
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    setFilteredCards(
      cards.filter(
        card =>
          card.name.toLowerCase().includes(search.toLowerCase()) ||
          card.race.toLowerCase().includes(search.toLowerCase()) ||
          card.desc.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [cards, search]);

  return (
    <div className='container'>
      <div className='row g-1'>
        <div className="col-md-12 mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {filteredCards.map(card => (
          <div key={card.id} className="card col-xl-2 col-md-3 col-sm-4 col-xs-6" style={{ height: '370px' }}>
            {/* <LazyLoad offset={400}> */}
              <img src={`./imgs/${card.id}.jpg`} alt={card.name} style={{ width: '100%', height: '320px' }} />
              <h6>{card.name}</h6>
            {/* </LazyLoad> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery
