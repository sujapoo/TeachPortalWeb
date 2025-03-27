// src/Services/AuthService.js
import {api, signupApi} from './api';

class AuthService {
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data) {
        localStorage.setItem('token', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

 
  logout() {
    localStorage.removeItem('token');

  }


  getCurrentUserToken() {
    try {
      const token = localStorage.getItem('token');
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUserToken() !== null;
  }
}

export default new AuthService();
