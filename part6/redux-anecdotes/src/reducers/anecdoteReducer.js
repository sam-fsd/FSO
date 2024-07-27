import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    newAnecdote: (state, action) => {
      state.push(action.payload);
    },
    castVote: (state, action) => {
      const { id } = action.payload;

      return state.map((a) => (a.id !== id ? a : action.payload));
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { newAnecdote, castVote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    anecdoteService
      .getAll()
      .then((anecdotes) => dispatch(setAnecdotes(anecdotes)));
  };
};

export const addAnecdote = (anecdote) => {
  return async (dispatch) => {
    anecdoteService.createNew(anecdote).then((savedAnc) => {
      dispatch(newAnecdote(savedAnc));
    });
  };
};

export const vote = (anecdote) => {
  return async (dispatch) => {
    anecdoteService
      .createVote(anecdote)
      .then((savedAnc) => dispatch(castVote(savedAnc)));
  };
};

export default anecdoteSlice.reducer;
