import { jwtDecode } from 'jwt-decode';

class ApiClient {
  constructor() {
    this.baseUrl = '/api';
  }

  get token() {
    return localStorage.getItem('cvfd_token');
  }

  set token(value) {
    if (value) {
      localStorage.setItem('cvfd_token', value);
    } else {
      localStorage.removeItem('cvfd_token');
    }
  }

  get headers() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/forgot-password') {
           this.token = null; // Clear invalid token
           window.location.href = '/'; // Redirect to homepage where AccessModal is
        }
        
        let errorData;
        try {
           errorData = await response.json();
        } catch(e) {
           throw new Error(`HTTP Error: ${response.status}`);
        }
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
