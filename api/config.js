export const DI_API =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:7999' : 'http://di-api.herokuapp.com';

export const CMS_API = 'http://akilihub.io:8080';
export const REDIS_ADDR = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
export const REDIS_PORT = process.env.REDIS_PORT_6379_TCP_PORT || 6379;
