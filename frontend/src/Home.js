import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from './App'

function Home() {

  const { user } = useContext(UserContext)
  return (
    <div>home</div>
  )
}

export default Home