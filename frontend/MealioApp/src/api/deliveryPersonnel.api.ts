// src/api/deliveryPersonnel.api.ts
import axiosInstance from './axiosInstance';

// Create delivery personnel profile (for self or admin)
export const createDeliveryProfile = async (data: {
  driver_license_no: string;
  vehicle_type: string;
  user_id?: number; // optional (admin only)
}) => {
  const res = await axiosInstance.post('/delivery-personnel', data);
  return res.data;
};

// Get my delivery profile
export const getMyDeliveryProfile = async () => {
  const res = await axiosInstance.get('/delivery-personnel/me');
  return res.data;
};

