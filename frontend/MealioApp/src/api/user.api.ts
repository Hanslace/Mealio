import axiosInstance from './axiosInstance';

// ✅ Get logged-in user's profile
export const getMyProfile = async () => {
  const res = await axiosInstance.get('/user/profile');
  return res.data; // returns { user info + addresses }
};

// ✅ Update logged-in user's profile
export const updateMyProfile = async (payload: {
  full_name?: string;
  phone?: string;
  is_verified?: boolean;
}) => {
  const res = await axiosInstance.put('/user/profile', payload);
  return res.data; // returns success message
};

export const registerPushToken = async (push_token: string) => {
  try {
    const res = await axiosInstance.post('/users/register-push-token', { push_token });
    return res.data;
  } catch (error) {
    console.error('Error registering push token:', error);
    throw error;
  }
};