import axios from 'axios';
const baseUrl = 'http://localhost:3003/api';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.get(`${baseUrl}/blogs`, config);
  return request.then((response) => response.data);
};

const login = (credentials) => {
  const request = axios.post(`${baseUrl}/login`, credentials);
  return request.then((response) => response.data);
};

const create = (blogData) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.post(`${baseUrl}/blogs`, blogData, config);
  return request.then((response) => response.data);
};

const update = (newBlogData, id) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.patch(`${baseUrl}/blogs/${id}`, newBlogData, config);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const config = {
    headers: { Authorization: token },
  };

  axios.delete(`${baseUrl}/blogs/${id}`, config);
};

export default { getAll, setToken, create, login, update, remove };
