import axios from 'axios';
import { requestInterceptor, responseInterceptor, errorInterceptor } from './middleware';

const api = axios.create({
  baseURL: 'http://localhost:3333/',
  timeout: 5000,
});

api.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
api.interceptors.response.use(responseInterceptor, errorInterceptor);

export default api;
