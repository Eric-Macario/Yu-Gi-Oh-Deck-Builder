import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from './App'

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null)
  };

  return (
    <div>
      <Link to="/home">Home</Link>
      <Link to="/gallery">Gallery</Link>
      <Link to="/decks">Decks</Link>
      <Link to={`/profile/${user?.id}`}>Profile</Link>
      <Link to="/">
      <button onClick={handleLogout}>Logout</button>
      </Link>
    </div>
  );
}

export default Navbar
