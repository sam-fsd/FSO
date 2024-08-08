import React from 'react'
import { Typography } from '@mui/material'

const User = ({ user }) => {
  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <div>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>
              <Typography variant="overline">{blog.title}</Typography>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default User
