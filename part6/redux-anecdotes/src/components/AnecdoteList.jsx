import { useSelector, useDispatch } from 'react-redux';
import { castVote } from '../reducers/anecdoteReducer';
import { clear, nofify } from '../reducers/notificationReducer';

const Anecdote = ({ anecdote, handleVote }) => (
  <div>
    <div>{anecdote.content}</div>
    <div>
      has {anecdote.votes}
      <button onClick={() => handleVote(anecdote.id)}>vote</button>
    </div>
  </div>
);

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const compareFn = (a, b) => a.votes - b.votes;
    const sortedAnecdotes = [...anecdotes];
    const lowerCaseFilter = filter.toLowerCase();
    return sortedAnecdotes
      .filter((a) => a.content.toLowerCase().includes(lowerCaseFilter))
      .sort(compareFn)
      .reverse();
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(castVote(id));
    const votedAnc = anecdotes.find((a) => a.id === id);
    dispatch(nofify(`you voted '${votedAnc.content}'`));
    setTimeout(() => {
      dispatch(clear());
    }, 5000);
  };
  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} handleVote={vote} />
      ))}
    </div>
  );
};

export default AnecdoteList;
