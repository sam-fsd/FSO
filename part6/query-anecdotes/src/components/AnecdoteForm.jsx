import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { createNew } from '../requests';
import NotificationContext from '../NotificationContext';

const AnecdoteForm = () => {
  const [message, messageDispatch] = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote));
    },
    onError: () => {
      messageDispatch({
        type: 'NOTIFY',
        payload: `too short anecdote, must have length 5 or more`,
      });
      setTimeout(() => {
        messageDispatch({ type: 'CLEAR' });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    newAnecdoteMutation.mutate({ content, votes: 0 });
    messageDispatch({ type: 'NOTIFY', payload: `anecdote '${content}' added` });
    setTimeout(() => {
      messageDispatch({ type: 'CLEAR' });
    }, 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
