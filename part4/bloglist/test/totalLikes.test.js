const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const { listWithOneBlog, biggerList } = require('../utils/blogs');

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test('of list with zero blogs', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('of bigger list', () => {
    const result = listHelper.totalLikes(biggerList);
    assert.strictEqual(result, 36);
  });
});
