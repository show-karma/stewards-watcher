import axios, { AxiosInstance } from 'axios';
import { useAuth } from 'contexts/auth';
import { KARMA_API } from './karma';

// ----------------------------------------------------------------------

export const AxiosClient = () => {
  const { authToken } = useAuth();
  const api: AxiosInstance = axios.create({
    timeout: 30000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
  });
  return api;
};

export const api = axios.create({
  timeout: 30000,
  baseURL: KARMA_API.base_url,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default AxiosClient;
