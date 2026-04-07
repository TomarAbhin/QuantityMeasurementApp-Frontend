import api from './axios';

const AuthService = {
  login: async (username, password) => {
    const response = await api.post('/api/auth/signin', { username, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  signup: async (username, email, password) => {
    const response = await api.post('/api/auth/signup', {
      username,
      email,
      password,
      roles: ['user'],
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  },

  isAuthenticated: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return !!user?.token;
  },
};

export default AuthService;
