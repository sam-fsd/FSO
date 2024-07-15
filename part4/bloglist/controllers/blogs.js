const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = request.user;

  if (!user) return response.status(401).json({ error: 'token invalid' });

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes,
    user: user._id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = request.user;
  const userid = user.id;
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(404).json({ error: 'blog not found' });

  if (blog.user.toString() === userid.toString()) {
    const deletedBlog = await Blog.findByIdAndDelete(blog._id);
    if (!deletedBlog) return response.status(404).end();
    response.status(204).end();
  } else {
    return response.status(403).json({ error: 'Not owner of resource' });
  }
});

blogRouter.patch('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
    user: body.user,
  };

  const updatedblog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedblog);
});

module.exports = blogRouter;
