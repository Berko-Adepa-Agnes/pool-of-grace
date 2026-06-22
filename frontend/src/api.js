import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
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

export const getMentors = () => API.get('/mentorship/mentors');
export const bookMentorship = (bookingData) => API.post('/mentorship/book', bookingData);
export const getMentorshipSessions = () => API.get('/mentorship/sessions');

export const getForumPosts = () => API.get('/forum/posts');
export const createForumPost = (postData) => API.post('/forum/posts', postData);
export const createForumComment = (postId, commentData) => API.post(`/forum/posts/${postId}/comments`, commentData);

export default API;