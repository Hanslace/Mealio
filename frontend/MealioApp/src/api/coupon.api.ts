import axiosInstance from './axiosInstance';

// Create a new coupon
export const createCoupon = async (data: {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  valid_from: string; // ISO date string
  valid_until: string; // ISO date string
  usage_limit?: number;
}) => {
  const res = await axiosInstance.post('/coupons', data); // 👈 Corrected /coupons
  return res.data;
};

// Update existing coupon
export const updateCoupon = async (couponId: number, data: {
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  valid_from?: string;
  valid_until?: string;
  usage_limit?: number;
}) => {
  const res = await axiosInstance.put(`/coupons/${couponId}`, data); // 👈 Corrected /coupons
  return res.data;
};

// Delete a coupon
export const deleteCoupon = async (couponId: number) => {
  const res = await axiosInstance.delete(`/coupons/${couponId}`); // 👈 Corrected /coupons
  return res.data;
};

// Get all available coupons
export const getAllCoupons = async () => {
  const res = await axiosInstance.get('/coupons'); // 👈 Corrected /coupons
  return res.data;
};

// Get a specific coupon by code
export const getCouponByCode = async (code: string) => {
  const res = await axiosInstance.get(`/coupons/code/${code}`); // 👈 Corrected route for /coupons/code/:code
  return res.data;
};
