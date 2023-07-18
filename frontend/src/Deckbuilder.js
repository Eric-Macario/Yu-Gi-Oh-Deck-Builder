import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from './App'
import { useParams } from 'react-router-dom'

function Deckbuilder() {
  const { user } = useContext(UserContext)
  const { deckId } = useParams()
  const [cards, setCards] = useState([])
  const [search, setSearch] = useState('')
  const [filteredCards, setFilteredCards] = useState([])
  const [deckCards, setDeckCards] = useState([])

  const fetchCards = () => {
    fetch('http://127.0.0.1:5555/cards')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched cards:', data);
        setCards(data);
      })
      .catch(error => {
        console.error('Error fetching cards:', error)
      })
  }

  const fetchDeckCards = () => {
    fetch(`http://127.0.0.1:5555/decks/${deckId}/cards`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched deck cards:', data);
        setDeckCards(data);
      })
      .catch(error => {
        console.error('Error fetching deck cards:', error);
      })
  }

  useEffect(() => {
    fetchCards();
    fetchDeckCards();
  }, []);

  useEffect(() => {
    setFilteredCards(
      cards.filter(
        card =>
          card.name.toLowerCase().includes(search.toLowerCase()) ||
          card.race.toLowerCase().includes(search.toLowerCase()) ||
          card.desc.toLowerCase().includes(search.toLowerCase()) ||
          card.card_type.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [cards, search]);

  const extraDeckCards = deckCards.filter(
    card =>
      card.card_type === "XYZ Monster" ||
      card.card_type === "Synchro Monster" ||
      card.card_type === "Link Monster" ||
      card.card_type === "Fusion Monster"
  )

  const deckCardsFiltered = deckCards.filter(
    card =>
      card.card_type !== "XYZ Monster" &&
      card.card_type !== "Synchro Monster" &&
      card.card_type !== "Link Monster" &&
      card.card_type !== "Fusion Monster"
  )

  const handleCardClick = (card) => {
    const newCard = {
      card_ids: [card.id]
    };
  
    fetch(`http://127.0.0.1:5555/decks/${deckId}/cards`, {
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
        console.log('Card added to deck successfully');
        fetchDeckCards();
      })
      .catch(error => {
        console.error('Error adding card to deck:', error);
      });
  }

  const handleDelete = (card) => {
    const cardId = card.id;
  
    fetch(`http://127.0.0.1:5555/decks/${deckId}/cards`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ card_id: [cardId] }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Card removed from deck successfully');
        fetchDeckCards();
      })
      .catch(error => {
        console.error('Error removing card from deck:', error);
      });
  }

  const calculateTotalPrice = (cardArray) => {
    return cardArray.reduce((total, card) => total + card.tcgplayer_price, 0);
  }

  return (
    <div className="container deckbuilder">
      <div className="row g-5">
        <div className="col-7">
          <h5 className="deck-heading">Deck Price: ${calculateTotalPrice(deckCardsFiltered).toFixed(2)}</h5>
          <div className="container deck-container" style={{ height: '620px', overflow: 'auto'}} >
            <div className="row">
            {deckCardsFiltered.map(card => (
                <div key={`${card.id}`} className="card col-2" >
                  <img
                    src={`../imgs/${card.id}.jpg`}
                    alt={card.name}
                    style={{ height: '175px', width: '100%'  }}
                    onClick={() => handleDelete(card)}
                  />
                </div>
              ))}
            </div>
          </div>
          <h5 className="deck-heading">Extra Deck Price: ${calculateTotalPrice(extraDeckCards).toFixed(2)}</h5>
            <div className="container extra-deck-container" style={{ height: '230px', overflow: 'auto'}}>
              <div className="row">
                {extraDeckCards.map(card=> (
                  <div key={`${card.id}`} className="card col-2" >
                    <img
                      src={`../imgs/${card.id}.jpg`}
                      alt={card.name}
                      style={{ height: '150px', width: '100%' }}
                      onClick={() => handleDelete(card)}
                    />
                  </div>
                ))}
              </div>
            </div>
        </div>
        <div className="col-5">
          <h5 className="selection-heading">Selection</h5>
          <div className="container selection-container" style={{ height: '890px', overflow: 'auto'}}>
            <div className="row g-1">
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
                <div
                  key={card.id}
                  className="card col-xl-3 col-md-3 col-sm-4 col-xs-6"
                  style={{ height: '210px' }}
                  onClick={() => handleCardClick(card)}
                >
                  <img
                    src={`../imgs/${card.id}.jpg`}
                    alt={card.name}
                    style={{ width: '100%', height: '200px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Deckbuilder
