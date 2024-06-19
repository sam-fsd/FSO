const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const { biggerList, listWithOneBlog, onlyTwoBlogs } = require('../utils/blogs');

describe('mostBlogs', () => {
  test('of list with many blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(biggerList), {
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });

  test('of list with one blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    });
  });

  test('empty list', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null);
  });

  test('undefined list', () => {
    assert.strictEqual(listHelper.mostBlogs(), null);
  });

  test('of list with authors with same number of blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(onlyTwoBlogs), {
      author: 'Robert C. Martin',
      blogs: 1,
    });
  });
});
