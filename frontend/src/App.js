import React, { createContext, useEffect, useState } from 'react';
import { Routes, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './Login.js';
import Home from './Home.js';
import Gallery from './Gallery.js';
import Decks from './Decks.js';
import Deckbuilder from './Deckbuilder.js';
import Profile from './Profile.js';
import Navbar from './Navbar.js';
import Signup from './Signup.js';

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/decks" element={<Decks />} />
          <Route path="/deckbuilder/:deckId" element={<Deckbuilder />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
