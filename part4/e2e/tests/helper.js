const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  const loggedUserData = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('loggedBlogAppUser'));
  });

  console.log(loggedUserData);
};

const createBlog = async (page, author, title, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click();
  await page.getByTestId('title').fill(title);
  await page.getByTestId('author').fill(author);
  await page.getByTestId('url').fill(url);

  await page.getByRole('button', { name: 'create' }).click();
};

module.exports = { loginWith, createBlog };
