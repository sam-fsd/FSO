const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const { biggerList, listWithOneBlog, onlyTwoBlogs } = require('../utils/blogs');

describe('most likes', () => {
  test('of list with many blogs', () => {
    assert.deepStrictEqual(listHelper.mostLikes(biggerList), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });

  test('of list with one blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('empty list', () => {
    assert.strictEqual(listHelper.mostLikes([]), null);
  });

  test('undefined list', () => {
    assert.strictEqual(listHelper.mostLikes(), null);
  });

  test('of list with authors with same number of likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(onlyTwoBlogs), {
      author: 'Robert C. Martin',
      likes: 10,
    });
  });
});
