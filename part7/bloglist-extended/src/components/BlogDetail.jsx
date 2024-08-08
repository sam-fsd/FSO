import React, { useState } from 'react'
import {
  Box,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
} from '@mui/material'

import { Link } from 'react-router-dom'

const BlogDetail = ({ blog, likeBlog, postComment }) => {
  const [commentText, setCommentText] = useState('')
  if (!blog)
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    )

  const genUniqueKey = (index) => {
    // Combine the index with a timestamp to ensure uniqueness
    return `${index}_${new Date().getTime()}`
  }

  const addComment = (event) => {
    event.preventDefault()
    postComment(blog.id, commentText)

    setCommentText('')
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">{blog.title}</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6">{blog.author}</Typography>
        <Typography
          variant="body1"
          sx={{ mb: 1 }}
        >
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 1 }}
        >
          {blog.likes} likes{' '}
          <Button
            color="success"
            onClick={() => likeBlog(blog)}
          >
            like
          </Button>
        </Typography>
        <Typography variant="body1">
          added by <Link to={`/users/${blog.user.id}`}>{blog.user.name}</Link>
        </Typography>
      </CardContent>
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 1 }}
        >
          comments
        </Typography>
        <form onSubmit={addComment}>
          <TextField
            sx={{ mr: 1 }}
            size="small"
            label="comment"
            value={commentText}
            onChange={({ target }) => setCommentText(target.value)}
          />
          <Button
            variant="text"
            type="submit"
          >
            add comment
          </Button>
        </form>
        <ul>
          {blog.comments.map((c, index) => (
            <li key={genUniqueKey(index)}>{c}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default BlogDetail
