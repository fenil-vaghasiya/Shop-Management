import api from './axios';

export const loginApi = async (data: {
  username: string;
  password: string;
}) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};
