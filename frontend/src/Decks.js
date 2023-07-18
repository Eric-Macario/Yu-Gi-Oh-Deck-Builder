import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from './App'
import { Link } from 'react-router-dom'
import image from "./cssimages/deckbox-removebg-preview.png"

function Decks() {
  const { user } = useContext(UserContext);
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState('')

  useEffect(() => {
    if (user) {
      fetch(`http://127.0.0.1:5555/decks?user_id=${user.id}`)
        .then(response => response.json())
        .then(data => setDecks(data))
        .catch(error => {
          console.error('Error fetching decks:', error)
        });
    }
  }, [user]);

  const handleCreateDeck = () => {
    if (newDeckName.trim() !== '') {
      const newDeck = {
        name: newDeckName.trim(),
        user_id: user.id,
      };
  
      fetch('http://127.0.0.1:5555/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeck),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text()
        })
        .then(responseText => {
          if (responseText === 'Deck created successfully') {
            fetch(`http://127.0.0.1:5555/decks?user_id=${user.id}`)
              .then(response => response.json())
              .then(data => setDecks(data))
              .catch(error => {
                console.error('Error fetching decks:', error);
              });
  
            setNewDeckName('');
          } else {
            console.error('Error creating deck:', responseText);
          }
        })
        .catch(error => {
          console.error('Error creating deck:', error);
        });
    }
  };
  
  
  

  const handleDeleteDeck = (deckId) => {
    fetch(`http://127.0.0.1:5555/decks/${deckId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
      })
      .catch(error => {
        console.error('Error removing deck:', error);
      });
  }

  return (
    <div className='container Decklist'>
      <h2>Decks</h2>
      <div className="row">
        <div className="col-md-12">
          <input
            type="text"
            value={newDeckName}
            onChange={e => setNewDeckName(e.target.value)}
            placeholder="New Deck Name..."
            className="new-deck-input"
          />
          <button onClick={handleCreateDeck} className="create-deck-button">Create Deck</button>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {decks.map(deck => {
            if (deck.user_id === user.id) {
              return (
                <div key={deck.id} className="card col-xl-3 offset-1" style={{ height: '370px', width: '200px' }}>
                  <h5>{deck.name}</h5>
                  <img src={`${image}` } alt={deck.name} style={{ width: '100%', height: '200px' }} />
                  <Link to={`/deckbuilder/${deck.id}`}>
                    <button className="edit-deck-button">
                      Edit Deck
                    </button>
                  </Link>
                  <button onClick={() => handleDeleteDeck(deck.id)} className="delete-deck-button">
                    Delete Deck
                  </button>
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default Decks