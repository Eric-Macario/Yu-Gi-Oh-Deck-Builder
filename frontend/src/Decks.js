import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from './App'
import { Link } from 'react-router-dom'

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
        user_id: user.id
      };

      fetch('http://127.0.0.1:5555/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDeck)
      })
        .then(response => response.json())
        .then(createdDeck => {
          setDecks(prevDecks => [...prevDecks, createdDeck])
          setNewDeckName('')
        })
    }
  }

  const handleDeleteDeck = (deckId) => {
    fetch(`http://127.0.0.1:5555/decks/${deckId}`, {
      method: 'DELETE'
    })
      .then(setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId)))
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={newDeckName}
          onChange={e => setNewDeckName(e.target.value)}
        />
        <button onClick={handleCreateDeck}>Create Deck</button>
      </div>
      <h2>Decks</h2>
      <div className="container">
        <div className="row">
          {decks.map(deck => {
            if (deck.user_id === user.id) {
              return (
                <div key={deck.id} className="card col-xl-3 offset-1" style={{ height: '370px', width: '200px' }}>
                  <h5>{deck.name}</h5>
                  <img src={"https://m.media-amazon.com/images/I/81hI1mjTvnL._AC_SL1500_.jpg"} alt={deck.name} style={{ width: '100%', height: '200px' }} />
                  <Link to={`/deckbuilder/${deck.id}`}>
                    <button>
                      Edit Deck
                    </button>
                  </Link>
                  <button onClick={() => handleDeleteDeck(deck.id)}>
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