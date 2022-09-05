import axios from 'axios';
import { GENERAL } from 'configs';

export const axiosInstance = axios.create({
  timeout: 30000, // 30 secs
  baseURL: GENERAL.KARMA_DELEGATES_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
