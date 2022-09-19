import axios from 'axios';
import { KARMA_API } from 'helpers';

export const axiosInstance = axios.create({
  timeout: 30000, // 30 secs
  baseURL: KARMA_API.base_url,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
