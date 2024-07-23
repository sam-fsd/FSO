import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  let container;
  let likeBlog;

  //Re-render component after cleanup(reset the virtual testing environment(jsdom))
  beforeEach(() => {
    const user = {
      name: 'testUser',
      username: 'theUser',
    };

    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user,
    };
    likeBlog = vi.fn();

    container = render(
      <Blog blog={blog} user={user} likeBlog={likeBlog} />
    ).container;
  });

  test("by default component renders blog's title and author", () => {
    const element = container.querySelector('.moreInfoDiv');

    expect(element).toHaveStyle('display: none');
  });

  test('more info is displayed when view button is clicked', async () => {
    const element = container.querySelector('.moreInfoDiv');
    screen.debug();
    const button = screen.getByText('view');
    const user = userEvent.setup();

    await user.click(button);

    expect(element).not.toHaveStyle('displaye: none');
  });

  test(' if the like button is clicked twice, corresponding event handler is called twice', async () => {
    const likeBtn = screen.getByText('like');
    const user = userEvent.setup();

    await user.click(likeBtn);
    await user.click(likeBtn);

    expect(likeBlog.mock.calls).toHaveLength(2);
  });
});
