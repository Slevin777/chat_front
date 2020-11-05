import axios from 'axios';

/* axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lc_token');
    if (token) config.headers['Authorization'] = token;
    return config;
  },
  (error) => Promise.reject(error)
); */

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};
