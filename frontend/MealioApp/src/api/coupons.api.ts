import axiosInstance from './axiosInstance';


export const getActiveCoupons = async (page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(`/coupons/active`, {
    params: { page, limit }
  });
  return data;
};