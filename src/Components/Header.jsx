import React from 'react'
import useAuth from '../Hooks/useAuth'

export default function Header() {
  const {user} = useAuth()
  return (
    <div>
      <h4>Header</h4> <span>User Name : {user.displayName}</span>
    </div>
  )
}
