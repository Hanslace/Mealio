import axiosInstance from './axiosInstance';

export const getTopRestaurants = async (
  lat: number, lng: number,
  page = 1, limit = 10
) => {
  const { data } = await axiosInstance.get(`/restaurants`, {
    params: { lat, lng, page, limit }
  });
  return data;
};