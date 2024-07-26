import { useDispatch } from 'react-redux';
import { newAnecdote } from '../reducers/anecdoteReducer';
import { clear, nofify } from '../reducers/notificationReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const createAnecdote = (event) => {
    event.preventDefault();
    const value = event.target.anecdote.value;
    event.target.anecdote.value = '';

    dispatch(newAnecdote(value));
    dispatch(nofify(`you added '${value}'`));
    setTimeout(() => {
      dispatch(clear());
    }, 5000);
  };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
