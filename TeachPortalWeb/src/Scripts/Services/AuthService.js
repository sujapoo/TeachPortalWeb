// src/Services/AuthService.js
import {api, signupApi} from './api';

class AuthService {
  // Login method
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout method
  logout() {
    localStorage.removeItem('user');
    // Additional logout logic if needed
  }

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
}

export default new AuthService();
