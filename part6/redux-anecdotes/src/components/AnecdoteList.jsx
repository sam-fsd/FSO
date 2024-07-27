import { useSelector, useDispatch } from 'react-redux';
import { vote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

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

  const castVote = (id) => {
    const anecdoteToVoteFor = anecdotes.find((anc) => anc.id === id);
    const votedAnecdote = {
      ...anecdoteToVoteFor,
      votes: anecdoteToVoteFor.votes + 1,
    };

    dispatch(vote(votedAnecdote));

    dispatch(setNotification(`you voted '${anecdoteToVoteFor.content}'`, 1));
  };
  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} handleVote={castVote} />
      ))}
    </div>
  );
};

export default AnecdoteList;
