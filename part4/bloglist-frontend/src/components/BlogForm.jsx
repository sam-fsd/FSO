import Input from './Input';
import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setAuthor('');
    setTitle('');
    setUrl('');
  };

  return (
    <div className="formDiv">
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <Input
          inputName="title:"
          type="text"
          id="title-input"
          testid="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <Input
          inputName="author:"
          type="text"
          id="author-input"
          testid="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <Input
          inputName="url:"
          type="text"
          id="url-input"
          testid="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
