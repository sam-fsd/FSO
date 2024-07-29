import { useReducer } from 'react';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAll, castVote } from './requests';
import NotificationContext from './NotificationContext';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.payload;

    case 'CLEAR':
      return '';
    default:
      break;
  }
};

const App = () => {
  const [message, messageDispatch] = useReducer(notificationReducer, '');
  const queryClient = useQueryClient();
  const voteMutation = useMutation({
    mutationFn: castVote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
    },
  });

  const handleVote = (anecdote) => {
    const findAnecdote = anecdotes.find((a) => a.id === anecdote.id);
    const votedAnecdote = {
      ...findAnecdote,
      votes: findAnecdote.votes + 1,
    };
    voteMutation.mutate(votedAnecdote);
  };

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 2,
  });
  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return (
      <span>anecdote service is not available due to problems in server</span>
    );
  }

  const anecdotes = result.data;

  return (
    <NotificationContext.Provider value={[message, messageDispatch]}>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </NotificationContext.Provider>
  );
};

export default App;
