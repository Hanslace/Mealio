import axiosInstance from './axiosInstance';

export const getPopularMenuItems = async (
  lat: number, lng: number,
  page = 1, limit = 10
) => {
  const { data } = await axiosInstance.get(`/menu-items/popular`, {
    params: { lat, lng, page, limit }
  });
  return data;
};