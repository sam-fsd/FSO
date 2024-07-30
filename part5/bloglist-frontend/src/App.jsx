import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Input from './components/Input';
import {
  SuccessNotification,
  ErrorNotification,
} from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      const compareFn = (a, b) => a.likes - b.likes;
      blogs.sort(compareFn).reverse();
      setBlogs(blogs);
    });
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await blogService.login({ username, password });
      setUser(user);
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setUsername('');
      setPassword('');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
    setUsername('');
    setPassword('');
    blogService.setToken(null);
  };

  const handleNewBlog = async (newObject) => {
    try {
      blogService.setToken(user.token);
      const newBlog = await blogService.create(newObject);
      blogFormRef.current.toggleVisibility();
      setSuccessMessage(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      );

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      setBlogs(blogs.concat(newBlog));
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const addLike = async (blog) => {
    try {
      // Find the index of the blog in the blogs array
      const blogIndex = blogs.findIndex((b) => b.id === blog.id);
      if (blogIndex === -1) return;

      // Create a new blogs array with the updated blog
      const updatedBlogs = blogs.map((b, index) =>
        index === blogIndex ? { ...b, likes: b.likes + 1 } : b
      );

      await blogService.update(updatedBlogs[blogIndex], blog.id);

      // Update the state with the new blogs array
      setBlogs(updatedBlogs);
    } catch (error) {
      setErrorMessage('Something went wrong liking blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.error(error);
    }
  };

  const removeBlog = async (blog) => {
    try {
      const message = `Remove blog ${blog.title} by ${blog.author}`;
      if (window.confirm(message)) {
        const updatedBlogs = blogs.filter((b) => b.id !== blog.id);
        await blogService.remove(blog.id);
        setBlogs(updatedBlogs);
      }
    } catch (error) {
      setErrorMessage('Something went wrong deleting blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.error(error);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <ErrorNotification message={errorMessage} />
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
    );
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <SuccessNotification message={successMessage} />
        <ErrorNotification message={errorMessage} />
        <p>
          {user.name} is logged in
          <button onClick={handleLogout}>Logout</button>
        </p>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
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
    );
  }
};

export default App;
