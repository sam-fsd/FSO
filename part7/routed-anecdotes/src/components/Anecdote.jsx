import React from 'react';

const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <div>
        <h2>{anecdote.content}</h2>
      </div>
      <p>has {anecdote.votes}</p>
    </div>
  );
};

export default Anecdote;
