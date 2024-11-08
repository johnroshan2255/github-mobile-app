import axios from 'axios';
import { BASE_URl } from '@/config/config';
import { requestInterceptor, responseInterceptor, errorInterceptor } from './middleware';

const api = axios.create({
  baseURL: BASE_URl,
  timeout: 5000,
});

api.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
api.interceptors.response.use(responseInterceptor, errorInterceptor);

export default api;
