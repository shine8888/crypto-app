import axios from 'axios';
import { LOGIN_URL, REGISTER_URL } from '../constants/services.constants';

const client = axios.create();

client.interceptors.response.use(
  (res) => res,
  (err) => {
    throw new Error(err.response.data.message);
  },
);

const register = async (name, email, password) => {
  return await client
    .post(REGISTER_URL, { name, email, password })
    .then((response) => {
      return response.data.data;
    })
    .catch((errors) => {
      throw new Error(errors);
    });
};

const login = async (email, password) => {
  return await client
    .post(LOGIN_URL, { email, password })
    .then((response) => {
      if (response.data.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data.data;
    })
    .catch((errors) => {
      throw new Error(errors);
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  logout,
};
