import { env } from '@/config/environment';

export const BASE_URL =
  env.NODE_ENV === 'development'
    ? `${env.LOCAL_API_URL}:${env.LOCAL_API_PORT}`
    : env.API_URL;
