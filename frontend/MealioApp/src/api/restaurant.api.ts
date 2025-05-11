import axiosInstance from './axiosInstance';

// ✅ Create a new restaurant
export const createRestaurant = async (payload: {
  restaurant_name: string;
  license_number: string;
  address: string;
}) => {
  const res = await axiosInstance.post('/restaurants', payload);
  return res.data;
};

// ✅ Fetch restaurants owned by current logged-in owner
export const getMyRestaurants = async () => {
  const res = await axiosInstance.get('/restaurants/mine');   // was '/my'
  return res.data;
};

// ✅ Update your restaurant details
export const updateRestaurant = async (
  restaurantId: number,
  payload: {
    restaurant_name?: string;
    address?: string;
    contact_phone?: string;
    opening_time?: string;
    closing_time?: string;
    status?: string;
  }
) => {
  const res = await axiosInstance.put(`/restaurants/${restaurantId}`, payload);
  return res.data;
};

// ✅ Publicly fetch all open restaurants (for customers)
export const getAllRestaurants = async () => {
  const res = await axiosInstance.get('/restaurants');
  return res.data;
};

// ✅ Search restaurants by name (for customers)
export const searchRestaurantsByName = async (name: string) => {
  const res = await axiosInstance.get(
    `/restaurants/search?name=${encodeURIComponent(name)}`  // was '/search?name=...'
  );
  return res.data;
};
