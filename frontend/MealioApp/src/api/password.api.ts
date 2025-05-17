import axiosInstance from './axiosInstance';

export const forgotPassword = async (email: string) => {
  const res = await axiosInstance.post('/auth/forgot-password', { email });
  return res.data;  // TS infers this is { message: string }
};