import { useSelector, useDispatch } from 'react-redux';
import { castVote } from '../reducers/anecdoteReducer';

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
  const anecdotes = useSelector((state) => state);
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(castVote(id));
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
