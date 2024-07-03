const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const { rawBlogs } = require('../utils/blogs');
const app = require('../app');

const Blog = require('../models/blog');
const helper = require('./test_helper');
const User = require('../models/user');
const api = supertest(app);

describe('when there are blogs saved to the database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = rawBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);

    //create a user to generate token for
    const newUser = {
      username: 'vice',
      name: 'MrUser',
      password: 'pass',
    };
    await api.post('/api/users').send(newUser);
  });

  const tokenExtractor = async () => {
    const newUser = {
      username: 'vice',
      password: 'pass',
    };
    const response = await api.post('/api/login').send(newUser);

    return response.body.token;
  };

  test('blogs are returned as JSON', async () => {
    const token = await tokenExtractor();
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // Set token in header for test
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are three blogs', async () => {
    const token = await tokenExtractor();

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(response.body.length, rawBlogs.length);
  });

  describe('viewing a specific blog', () => {
    test('return object has well formated id property name', async () => {
      const token = await tokenExtractor();
      const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`);
      const blog = response.body[0];

      assert.ok(blog.hasOwnProperty('id'));
    });
  });

  describe('addition of a new blog', () => {
    test('blogs are added to db successfully for valid token', async () => {
      const token = await tokenExtractor();

      const blog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      };
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // Set token in header for test
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsInTheEnd = await helper.blogsInDb();
      assert.strictEqual(blogsInTheEnd.length, rawBlogs.length + 1);

      const titles = blogsInTheEnd.map((blog) => blog.title);
      assert(titles.includes('Canonical string reduction'));
    });
    test('adding blogs fails with proper status code if token is not provided', async () => {
      const blog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      };

      await api.post(`/api/blogs`).send(blog).expect(401);
    });
  });

  describe('testing fields for our JSON', () => {
    test('likes field defaults to 0 if not defined', async () => {
      const token = await tokenExtractor();

      const blog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      };

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.ok(response.body.hasOwnProperty('likes'));
      assert.strictEqual(response.body.likes, 0);
    });

    test('missing title or url field raises a BAD_REQUEST error', async () => {
      const token = await tokenExtractor();

      const blog = {
        author: 'Edsger W. Dijkstra',
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
        .expect(400);
    });
  });

  describe('updating of blogs', () => {
    test('updating existing blog', async () => {
      const token = await tokenExtractor();

      const blogs = await helper.blogsInDb();
      const blogId = blogs[0].id;
      const newLikes = { likes: 30 };

      const response = await api
        .patch(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(newLikes)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, 30);
    });
  });

  describe('deletion of blogs', async () => {
    test('fails when deleting an invalid id', async () => {
      const token = await tokenExtractor();

      const invalidId = 'thisisinvalidid';

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    test('deleting a non-existing blog returns a NOT_FOUND', async () => {
      const token = await tokenExtractor();

      const validNonexistingId = '55726de6a79383c5f6716bf6';

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});

describe('when there is only one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a new username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if passoword is less than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'new User',
      name: 'Superuser',
      password: 'sa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        'Password is shorter than the minimum allowes length (3)'
      )
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username is less than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ne',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('User validation failed'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
