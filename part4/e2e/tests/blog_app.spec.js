const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await page.goto('http://localhost:5173');
    await request.post('http://localhost:3003/api/testing/reset');

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    });
  });

  test('Login form is shown', async ({ page }) => {
    const formTitleElement = page.getByText('Log in to application');

    await expect(formTitleElement).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');

      await expect(
        page.getByText('Matti Luukkainen is logged in')
      ).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong');

      const errorDiv = await page.locator('.error');
      await expect(errorDiv).toContainText('invalid username or password');
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
      await expect(
        page.getByText('Matti Luukkainen is logged in')
      ).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'playwright',
        'blog created by playwright',
        'https://playwright.dev'
      );

      await page.getByRole('button', { name: 'create' }).click();

      await expect(
        page.getByRole('heading', { name: 'Create new' })
      ).toBeVisible();

      await expect(
        page.getByText('blog created by playwright').last()
      ).toBeVisible();
    });

    test('a blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'playwright',
        'another blog created by playwright',
        'https://playwright.dev'
      );

      await page.getByRole('button', { name: 'view' }).click();
      await page.getByRole('button', { name: 'like' }).click();

      await expect(page.getByText('Likes 1')).toBeVisible();
    });

    //Fails due to lack of localStorage in the playwright-controlled browser context

    /* test('user who added the blog can delete the blog', async ({ page }) => {
      await createBlog(
        page,
        'playwright',
        'blog created by playwright',
        'https://playwright.dev'
      );

      await page.getByRole('button', { name: 'view' }).click();
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible();
    }); */
  });
});
