import axiosInstance from './axiosInstance';

// ✅ Create a new restaurant
export const createRestaurant = async (payload: {
  restaurant_name: string;
  license_number: string;
  address: string;
}) => {
  const res = await axiosInstance.post('/restaurant', payload);
  return res.data; // returns created restaurant
};

// ✅ Fetch restaurants owned by current logged-in owner
export const getMyRestaurants = async () => {
  const res = await axiosInstance.get('/restaurant/my');
  return res.data; // returns array of owned restaurants
};

// ✅ Update your restaurant details
export const updateRestaurant = async (restaurantId: number, payload: {
  restaurant_name?: string;
  address?: string;
  contact_phone?: string;
  opening_time?: string;
  closing_time?: string;
  status?: string; // 'open' | 'closed' etc.
}) => {
  const res = await axiosInstance.put(`/restaurant/${restaurantId}`, payload);
  return res.data; // updated restaurant
};

// ✅ Publicly fetch all open restaurants (for customers)
export const getAllRestaurants = async () => {
  const res = await axiosInstance.get('/restaurant');
  return res.data; // array of restaurants
};

// ✅ Search restaurants by name (for customers)
export const searchRestaurantsByName = async (name: string) => {
  const res = await axiosInstance.get(`/restaurant/search?name=${encodeURIComponent(name)}`);
  return res.data; // array of matched restaurants
};
