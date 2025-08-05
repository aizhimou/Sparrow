import { showError } from './utils';
import axios from 'axios';
import i18n from '../i18n';

export const API = axios.create({
  baseURL: import.meta.env.REACT_APP_SERVER ? import.meta.env.REACT_APP_SERVER : '',
});

API.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.language;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    showError(error);
  },
);
