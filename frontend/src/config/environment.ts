export const env = {
  NODE_ENV: import.meta.env.DEV ? 'development' : 'production',
  LOCAL_API_URL: import.meta.env.VITE_LOCAL_API_URL,
  API_URL: import.meta.env.VITE_API_URL,
  LOCAL_API_PORT: import.meta.env.VITE_LOCAL_API_PORT,
};
