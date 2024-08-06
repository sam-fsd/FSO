import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Input from './components/Input'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from './reducers/notificationReducer'
import {
  createBlog,
  initalizeBlogs,
  updateBlogs,
} from './reducers/blogsReducer'
import { setUser } from './reducers/userReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [messageType, setMessageType] = useState('')
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

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

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await blogService.login({ username, password })
      dispatch(setUser(user))
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
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
    setUsername('')
    setPassword('')
    blogService.setToken(null)
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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification type={messageType} />
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
          <button type="submit">Login</button>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Notification type={messageType} />
        <p>
          {user.name} is logged in
          <button onClick={handleLogout}>Logout</button>
        </p>
        <Togglable
          buttonLabel="create new blog"
          ref={blogFormRef}
        >
          <BlogForm createBlog={handleNewBlog} />
        </Togglable>

        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={addLike}
            user={user}
            deleteBlog={removeBlog}
          />
        ))}
      </div>
    )
  }
}

export default App
