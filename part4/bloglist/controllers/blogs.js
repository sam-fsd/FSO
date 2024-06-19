const blogRouter = require('express').Router();
const { response } = require('express');
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

blogRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
  if (!deletedBlog) return response.status(404).end();

  response.status(204).end();
});

blogRouter.patch('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
  };

  const updatedblog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedblog);
});

module.exports = blogRouter;
