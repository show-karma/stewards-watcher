import axios, { AxiosInstance } from 'axios';
import { useAuth } from 'contexts/auth';
import { KARMA_API } from './karma';

// ----------------------------------------------------------------------

export const api = axios.create({
  timeout: 30000,
  baseURL: KARMA_API.base_url,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const AxiosClient = () => {
  const { authToken } = useAuth();
  const instance: AxiosInstance = axios.create({
    timeout: 30000,
    baseURL: KARMA_API.base_url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
  });
  return instance;
};

export default AxiosClient;
