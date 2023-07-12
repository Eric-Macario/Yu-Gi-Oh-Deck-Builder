import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from './App'


function Profile() {

  const { user } = useContext(UserContext)
  return (
    <div>
      {user.username}
      <br />
      {user.name}
    </div>
  )
}

export default Profile