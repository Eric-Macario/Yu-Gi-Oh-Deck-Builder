import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from './App'

function Profile() {
  const { user } = useContext(UserContext);
  const [userCollection, setUserCollection] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/collections/${user.id}/cards`)
      .then(response => response.json())
      .then(data => setUserCollection(data))
      .catch(error => console.error('Error fetching user cards:', error));
  }, [user.id]);


  const handleDeleteFromCollection = (card) => {
    const cardId = card.id;

    fetch(`http://127.0.0.1:5555/collections/${user.id}/cards`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ card_ids: [cardId] }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        if (response.ok) {
          setUserCollection(prevCollection => prevCollection.filter(card => card.id !== cardId));
        } 
      })
      .catch(error => console.error('Error deleting card from collection:', error));
  }

  const calculateTotalPrice = (cardArray) => {
    return cardArray.reduce((total, card) => total + card.tcgplayer_price, 0);
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <p className="card-text">Welcome {user.username}</p>
            </div>
          </div>
        </div >
        <div className="col-md-6 card">
        <p className='pricetag'>Total Collection Value: ${calculateTotalPrice(userCollection).toFixed(2)}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            {userCollection.map(card => (
              <div key={card.id} className="col-md-6 mb-6 collectionborder " style={{ height: '800px' }}>
                <div className="card collectioncard">
                  <img
                    src={`../imgs/${card.id}.jpg`}
                    className="card-img-top mx-auto"
                    alt={card.name}
                    style={{ height: '300px', width: '200px' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{card.name}</h5>
                    <p className="card-text">{card.tcgplayer_price.toFixed(2)}</p>
                    <p className="card-text">{card.desc}</p>
                    <button onClick={() => handleDeleteFromCollection(card)} className="delete-fromcollection-button">
                    Delete From Collection
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
