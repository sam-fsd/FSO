import { useState } from 'react';

const Blog = ({ blog, likeBlog, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const expand = { display: visible ? '' : 'none' };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      <div style={expand} className="moreInfoDiv">
        <p>{blog.url}</p>
        <p>
          Likes {blog.likes}{' '}
          <button onClick={() => likeBlog(blog)}>like</button>{' '}
        </p>
        <p>{blog.user.name}</p>
        {blog.user.username === user.username ? (
          <button onClick={() => deleteBlog(blog)}>remove</button>
        ) : (
          'NOT OWNER OF RESOURCE'
        )}
      </div>
    </div>
  );
};

export default Blog;
