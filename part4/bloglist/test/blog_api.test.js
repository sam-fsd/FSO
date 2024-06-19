const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const { rawBlogs } = require('../utils/blogs');
const app = require('../app');

const Blog = require('../models/blog');
const helper = require('./test_helper');
const api = supertest(app);

describe('when there are blogs saved to the database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = rawBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are three blogs', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, rawBlogs.length);
  });

  describe('viewing a specific blog', () => {
    test('return object has well formated id property name', async () => {
      const response = await api.get('/api/blogs');
      const blog = response.body[0];

      assert.ok(blog.hasOwnProperty('id'));
    });
  });

  describe('addition of a new blog', () => {
    test('blogs are added to db successfully', async () => {
      const blog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      };

      await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsInTheEnd = await helper.blogsInDb();
      assert.strictEqual(blogsInTheEnd.length, rawBlogs.length + 1);

      const titles = blogsInTheEnd.map((blog) => blog.title);
      assert(titles.includes('Canonical string reduction'));
    });
  });

  describe('testing fields for our JSON', () => {
    test('likes field defaults to 0 if not defined', async () => {
      const blog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      };

      const response = await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.ok(response.body.hasOwnProperty('likes'));
      assert.strictEqual(response.body.likes, 0);
    });

    test.only('missing title or url field raises a BAD_REQUEST error', async () => {
      const blog = {
        author: 'Edsger W. Dijkstra',
      };

      await api.post('/api/blogs').send(blog).expect(400);
    });
  });

  describe('updating of blogs', () => {
    test('updating existing blog', async () => {
      const blogs = await helper.blogsInDb();
      const blogId = blogs[0].id;
      const newLikes = { likes: 30 };

      const response = await api
        .patch(`/api/blogs/${blogId}`)
        .send(newLikes)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, 30);
    });
  });

  describe('deletion of blogs', async () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, rawBlogs.length - 1);

      const titles = blogsAtEnd.map((r) => r.title);
      assert(!titles.includes(blogToDelete.title));
    });

    test('fails when deleting an invalid id', async () => {
      const invalidId = 'thisisinvalidid';

      await api.delete(`/api/blogs/${invalidId}`).expect(400);
    });

    test('deleting a non-existing blog returns a NOT_FOUND', async () => {
      const validNonexistingId = '55726de6a79383c5f6716bf6';

      await api.delete(`/api/blogs/${validNonexistingId}`).expect(404);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
