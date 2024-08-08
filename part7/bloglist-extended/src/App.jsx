import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Input from './components/Input'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/UsersList'
import User from './components/User'
import blogService from './services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from './reducers/notificationReducer'
import {
  createBlog,
  initalizeBlogs,
  updateBlogs,
} from './reducers/blogsReducer'
import { setUser } from './reducers/userReducer'
import { Routes, Link, useNavigate, Route, useMatch } from 'react-router-dom'
import BlogDetail from './components/BlogDetail'
import { Container, Typography, AppBar, Toolbar, Button } from '@mui/material'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const [messageType, setMessageType] = useState('')
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      const compareFn = (a, b) => a.likes - b.likes
      blogs.sort(compareFn).reverse()
      dispatch(initalizeBlogs(blogs))
    })
  }, [user])

  useEffect(() => {
    blogService.getAllUsers().then((users) => setUsers(users))
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await blogService.login({ username, password })
      dispatch(setUser(user))
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      navigate('/')
    } catch (error) {
      setMessageType('error')
      dispatch(showNotification(error.response.data.error))

      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(setUser(null))
    blogService.setToken(null)
    setUsername('')
    setPassword('')
  }

  const handleNewBlog = async (newObject) => {
    try {
      blogService.setToken(user.token)
      const newBlog = await blogService.create(newObject)
      blogFormRef.current.toggleVisibility()
      setMessageType('success')
      dispatch(
        showNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`
        )
      )
      dispatch(createBlog(newBlog))
    } catch (error) {
      setMessageType('error')
      dispatch(showNotification(error.response.data.error))
    }
  }

  const handleComment = async (blogId, comment) => {
    try {
      const blog = blogs.find((b) => b.id === blogId)
      if (!blog) return

      const updatedBlog = { ...blog, comments: blog.comments.concat(comment) }

      await blogService.createComment(blogId, { comment })

      const updatedBlogs = blogs.map((b) => (b.id === blogId ? updatedBlog : b))

      dispatch(updateBlogs(updatedBlogs))
    } catch (error) {
      if (error.response.status === 400) {
        setMessageType('error')
        dispatch(showNotification('comment cannot be empty'))
      }
    }
  }

  const addLike = async (blog) => {
    try {
      // Find the index of the blog in the blogs array
      const blogIndex = blogs.findIndex((b) => b.id === blog.id)
      if (blogIndex === -1) return

      // Create a new blogs array with the updated blog
      const updatedBlogs = blogs.map((b, index) =>
        index === blogIndex ? { ...b, likes: b.likes + 1 } : b
      )

      await blogService.update(updatedBlogs[blogIndex], blog.id)

      // Update the state with the new blogs array
      dispatch(updateBlogs(updatedBlogs))
    } catch (error) {
      setMessageType('error')
      dispatch(showNotification('Something went wrong liking blog'))
      console.error(error)
    }
  }

  const removeBlog = async (blog) => {
    try {
      const message = `Remove blog ${blog.title} by ${blog.author}`
      if (window.confirm(message)) {
        const updatedBlogs = blogs.filter((b) => b.id !== blog.id)
        await blogService.remove(blog.id)
        dispatch(updateBlogs(updatedBlogs))
      }
    } catch (error) {
      setMessageType('error')
      dispatch(showNotification('Something went wrong deleting blog'))

      console.error(error)
    }
  }

  const isUserUrl = useMatch('/users/:id')
  const userMatch = isUserUrl
    ? users.find((user) => user.id === isUserUrl.params.id)
    : null

  const isBlogUrl = useMatch('/blogs/:id')
  const blogMatch = isBlogUrl
    ? blogs.find((blog) => blog.id === isBlogUrl.params.id)
    : null

  const padding = {
    padding: 5,
  }

  if (user === null) {
    return (
      <Container>
        <Notification type={messageType} />
        <div>
          <h2>Log in to application</h2>
          <form onSubmit={handleLogin}>
            <Input
              inputName="username"
              type="text"
              testid="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <Input
              inputName="password"
              type="password"
              testid="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <Button
              sx={{ my: 1 }}
              variant="contained"
              color="success"
              type="submit"
            >
              Login
            </Button>
          </form>
        </div>
      </Container>
    )
  } else {
    return (
      <Container>
        <AppBar position="static">
          <Toolbar>
            <Button
              color="inherit"
              component={Link}
              to="/"
            >
              blogs
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/users"
            >
              users
            </Button>
            <Typography>
              {user.name} logged in{' '}
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Typography>
          </Toolbar>
        </AppBar>
        <Typography
          variant="h3"
          sx={{ my: 1 }}
        >
          blog app
        </Typography>
        <Notification type={messageType} />

        <Togglable
          buttonLabel="create new blog"
          ref={blogFormRef}
        >
          <BlogForm createBlog={handleNewBlog} />
        </Togglable>

        <Routes>
          <Route
            path="users"
            element={<Users users={users} />}
          />

          <Route
            path="/"
            element={blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
              />
            ))}
          />
          <Route
            path="users/:id"
            element={<User user={userMatch} />}
          />
          <Route
            path="blogs/:id"
            element={
              <BlogDetail
                blog={blogMatch}
                likeBlog={addLike}
                postComment={handleComment}
              />
            }
          />
        </Routes>
      </Container>
    )
  }
}

export default App
