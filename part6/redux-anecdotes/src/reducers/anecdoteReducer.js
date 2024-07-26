import { createSlice } from '@reduxjs/toolkit';

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    newAnecdote: (state, action) => {
      const content = action.payload;
      state.push({
        content,
        id: getId(),
        votes: 0,
      });
    },
    castVote: (state, action) => {
      const id = action.payload;
      const anecdoteToVoteFor = state.find((anc) => anc.id === id);
      const votedAnecdote = {
        ...anecdoteToVoteFor,
        votes: anecdoteToVoteFor.votes + 1,
      };

      return state.map((a) => (a.id !== id ? a : votedAnecdote));
    },
  },
});

// Using bare Redux
/*const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VOTE': {
      const id = action.payload.id;
      const anecdoteToVoteFor = state.find((anc) => anc.id === id);
      const votedAnecdote = {
        ...anecdoteToVoteFor,
        votes: anecdoteToVoteFor.votes + 1,
      };

      return state.map((a) => (a.id !== id ? a : votedAnecdote));
    }
    case 'NEW_ANECDOTE': {
      const compareFn = (a, b) => a.votes - b.votes;
      return [...state, action.payload].sort(compareFn).reverse();
    }
    default:
      return state;
  }
};

export const castVote = (id) => {
  return {
    type: 'VOTE',
    payload: {
      id,
    },
  };
};

export const newAnecdote = (anecdote) => {
  return {
    type: 'NEW_ANECDOTE',
    payload: {
      content: anecdote,
      id: getId(),
      votes: 0,
    },
  };
};

export default reducer; */
export const { newAnecdote, castVote } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
