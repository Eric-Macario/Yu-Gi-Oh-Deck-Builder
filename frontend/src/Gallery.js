import React, { useState, useEffect, useContext } from 'react'
import LazyLoad from 'react-lazyload'
import { UserContext } from './App'

function Gallery() {
  const { user } = useContext(UserContext)
  const [cards, setCards] = useState([])
  const [search, setSearch] = useState('')
  const [filteredCards, setFilteredCards] = useState([])

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

  const addToCollection = (card) => {
    console.log('User:', user)
    console.log('Card ID:', card.id)
    const newCard = {
      card_ids: [card.id]
    };

    fetch(`http://127.0.0.1:5555/collections/${user.id}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCard),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Card added to collection successfully');
    })
    .catch(error => {
      console.error('Error adding card to collection:', error)
    });
}

  return (
    <div className='container gallery'>
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
          <div key={card.id} className="card col-xl-2 col-md-3 col-sm-4 col-xs-6 transparent-card" style={{ height: '410px' }}>
  <img src={`./imgs/${card.id}.jpg`} alt={card.name} style={{ width: '100%', height: '320px' }} />
  <h6>{card.name}</h6>
  <button className="add-button" onClick={() => addToCollection(card)}>Add to Collection</button>
</div>
        ))}
      </div>
    </div>
  );
}

export default Gallery
