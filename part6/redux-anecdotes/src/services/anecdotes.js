import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (newAnecdote) => {
  const asObject = { content: newAnecdote, votes: 0 };
  const response = await axios.post(baseUrl, asObject);
  return response.data;
};

const createVote = async (anecdote) => {
  const { id } = anecdote;
  const response = await axios.put(`${baseUrl}/${id}`, anecdote);
  return response.data;
};

export default { getAll, createNew, createVote };
