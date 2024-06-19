const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const { biggerList, blogsWithSameLikes } = require('../utils/blogs');

describe('favoriteBlog', () => {
  test('of list with many blogs', () => {
    const result = listHelper.favoriteBlog(biggerList);

    assert.deepEqual(result, {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    });
  });

  test('of list with zero blogs', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null);
  });

  test('of undefined list', () => {
    assert.strictEqual(listHelper.favoriteBlog(), null);
  });

  test('of list with blogs with equal likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogsWithSameLikes), {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 10,
      __v: 0,
    });
  });

  test('of list with one blog', () => {
    assert.deepStrictEqual(
      listHelper.favoriteBlog([
        {
          _id: '5a422ba71b54a676234d17fb',
          title: 'TDD harms architecture',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
          likes: 10,
          __v: 0,
        },
      ]),
      {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 10,
        __v: 0,
      }
    );
  });
});
