import axios from 'axios';

export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the JWT to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    const isAuthCall = original.url?.includes('/api/token/');

    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      const refresh = localStorage.getItem(REFRESH_TOKEN);

      if (refresh) {
        try {
          // plain axios, so this call skips these interceptors
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
            { refresh }
          );
          localStorage.setItem(ACCESS_TOKEN, data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original); // retry the failed request once
        } catch {
          // refresh token is dead too, fall through to logout
        }
      }

      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
