// API Configuration
// In production on Railway, this will use the Railway backend URL
// In development, it uses localhost

const getApiBaseUrl = () => {
  // Always check for environment variable first (Railway will set this)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production build, try to use relative URL (if frontend and backend are on same domain)
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // Development: use localhost
  return 'http://localhost:8080/api';
};

export const API_BASE_URL = getApiBaseUrl();

