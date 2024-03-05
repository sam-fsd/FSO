import axios from 'axios';

const BASE_URL = 'http://localhost:3001/persons';

const getAll = () => {
  const request = axios.get(BASE_URL);
  return request.then((response) => response.data);
};
const add = (data) => {
  const request = axios.post(BASE_URL, data);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${BASE_URL}/${id}`);
  return request.then((response) => response.data);
};

const update = (id, data) => {
  const request = axios.put(`${BASE_URL}/${id}`, data);
  return request.then((response) => response.data);
};

export default { getAll, add, remove, update };
