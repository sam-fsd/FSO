import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('form submits blog with right info', async () => {
  const createBlog = vi.fn();
  const { container } = render(<BlogForm createBlog={createBlog} />);

  const user = userEvent.setup();
  const sendBtn = screen.getByText('Create');

  const titleInput = container.querySelector('#title-input');
  const authorInput = container.querySelector('#author-input');
  const urlInput = container.querySelector('#url-input');

  await user.type(titleInput, 'test title');
  await user.type(authorInput, 'test author');
  await user.type(urlInput, 'test url');

  await user.click(sendBtn);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('test title');
  expect(createBlog.mock.calls[0][0].author).toBe('test author');
  expect(createBlog.mock.calls[0][0].url).toBe('test url');
});
