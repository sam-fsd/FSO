import Input from './Input'
import { useState } from 'react'
import { Typography, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div className="formDiv">
      <Typography
        variant="h5"
        sx={{ mb: 1 }}
      >
        Create new
      </Typography>
      <form onSubmit={addBlog}>
        <Input
          inputName="Title"
          type="text"
          id="title-input"
          testid="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <Input
          inputName="Author"
          type="text"
          id="author-input"
          testid="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <Input
          inputName="Url"
          type="text"
          id="url-input"
          testid="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button
          sx={{ my: 1 }}
          variant="outlined"
          color="success"
          size="small"
          type="submit"
        >
          Create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
