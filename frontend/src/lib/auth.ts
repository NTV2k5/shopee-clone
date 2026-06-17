import { strapi } from './strapi';

export const auth = {
  login: async (identifier: string, password: string) => {
    const res = await strapi.post('/auth/local', { identifier, password });
    if (res.data.jwt) {
      localStorage.setItem('shopee_jwt', res.data.jwt);
      // Fetch full user with role info
      const userRes = await strapi.get('/users/me?populate=role', {
        headers: { Authorization: `Bearer ${res.data.jwt}` }
      });
      localStorage.setItem('shopee_user', JSON.stringify(userRes.data));
    }
    return res.data;
  },
  register: async (username: string, email: string, password: string) => {
    const res = await strapi.post('/auth/local/register', { username, email, password });
    if (res.data.jwt) {
      localStorage.setItem('shopee_jwt', res.data.jwt);
      // Fetch full user with role info
      const userRes = await strapi.get('/users/me?populate=role', {
        headers: { Authorization: `Bearer ${res.data.jwt}` }
      });
      localStorage.setItem('shopee_user', JSON.stringify(userRes.data));
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('shopee_jwt');
    localStorage.removeItem('shopee_user');
  },
  getUser: () => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('shopee_user') : null;
    return user ? JSON.parse(user) : null;
  },
  getToken: () => {
    return typeof window !== 'undefined' ? localStorage.getItem('shopee_jwt') : null;
  }
};

// Interceptor to add JWT to requests
strapi.interceptors.request.use((config) => {
  const token = auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 Unauthorized globally
strapi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('shopee_jwt');
        localStorage.removeItem('shopee_user');
        window.dispatchEvent(new Event('auth-change'));
      }
    }
    return Promise.reject(error);
  }
);
