import axiosInstance from './axiosInstance';

// ✅ Create a new notification
export const createNotification = async (payload: {
  user_id: number;
  title: string;
  body: string;
  type: string;
}) => {
  const res = await axiosInstance.post('/notifications', payload);
  return res.data; // Saved notification object
};

// ✅ Get notifications for a user
export const getNotifications = async (userId: number) => {
  const res = await axiosInstance.get(`/notifications/${userId}`);
  return res.data; // Array of notifications
};

// ✅ Mark a notification as read
export const markNotificationAsRead = async (notificationId: number) => {
  const res = await axiosInstance.put(`/notifications/${notificationId}/read`);
  return res.data; // { message: 'Notification marked as read' }
};
