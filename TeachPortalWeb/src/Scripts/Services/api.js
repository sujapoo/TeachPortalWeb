import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});


api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('token'));
    
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
     
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
const signupApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true, 
  });


export {api, signupApi};