const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) return null;

  const favourite = blogs.reduce((mostLikedSoFar, currentBlog) => {
    return currentBlog.likes > (mostLikedSoFar?.likes || 0)
      ? currentBlog
      : mostLikedSoFar;
  }, null);
  return favourite;
};

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null;

  let authorCount = {};

  blogs.forEach((blog) => {
    if (authorCount[blog.author]) {
      authorCount[blog.author]++;
    } else {
      authorCount[blog.author] = 1;
    }
  });

  let maxBlogs = 0;
  let topAuthor = '';

  for (const author in authorCount) {
    if (authorCount[author] > maxBlogs) {
      maxBlogs = authorCount[author];
      topAuthor = author;
    }
  }
  return { author: topAuthor, blogs: maxBlogs };
};

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null;

  let authorByLikes = {};

  blogs.forEach((blog) => {
    if (authorByLikes[blog.author]) {
      authorByLikes[blog.author] += blog.likes;
    } else {
      authorByLikes[blog.author] = blog.likes;
    }
  });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
