import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('poolofgrace_token');
  if (token) req.headers.Authorization = 'Bearer ' + token;
  return req;
});

export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);
export const getModules = () => API.get('/modules');
export const getModule = (id) => API.get('/modules/' + id);
export const getForumPosts = () => API.get('/forum');
export const createForumPost = (data) => API.post('/forum', data);
export const getJobs = () => API.get('/careers');

export default API;