import Http from './http';

const { VUE_APP_API_URL } = process.env;

const http = new Http({
  baseURL: VUE_APP_API_URL,
  timeout: 5000,
});

export { http };
