import axios from 'axios';

const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  return typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000/api'
      : '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('poolofgrace_token');
  if (token) {
    req.headers.Authorization = 'Bearer ' + token;
  }
  return req;
});

export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);
export const saveOnboarding = (onboardingData) => API.post('/auth/onboarding', { onboardingData });

export const getModules = () => API.get('/modules');
export const getModule = (id) => API.get('/modules/' + id);
export const completeModuleQuiz = (id, score) => API.post('/modules/' + id + '/complete', { score });
export const completeModuleStep = (id, payload) => API.post('/modules/' + id + '/complete', payload);

export const getMentors = () => API.get('/mentorship/mentors');
export const bookMentorship = (bookingData) => API.post('/mentorship/book', bookingData);
export const getMentorshipSessions = () => API.get('/mentorship/sessions');

export const getForumPosts = () => API.get('/forum/posts');
export const createForumPost = (postData) => API.post('/forum/posts', postData);
export const createForumComment = (postId, commentData) => API.post(`/forum/posts/${postId}/comments`, commentData);

export default API;