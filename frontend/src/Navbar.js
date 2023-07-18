import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from './App'
import './Navbar.css'

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null)
  };

  return (
    <div className="navbar navbar-expand-lg navbar-light main_box">
      <div className="container">
        <div className="navbar-collapse">
          <ul className="nav navbar-nav menu_nav ml-auto spread-items">
            <li><Link to="/home" className="cyber-link"><button className="cyber-button">Home</button></Link></li>
            <li><Link to="/gallery" className="cyber-link"><button className="cyber-button">Gallery</button></Link></li>
            <li><Link to="/decks" className="cyber-link"><button className="cyber-button">Decks</button></Link></li>
            <li><Link to={`/profile/${user?.id}`} className="cyber-link"><button className="cyber-button">Profile</button></Link></li>
            <li><Link to="/" className="cyber-link"><button onClick={handleLogout} className="cyber-button">Logout</button></Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
