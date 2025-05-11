import axiosInstance from './axiosInstance';

// ✅ Create a new menu item (Admin/Restaurant Owner)
export const createMenuItem = async (data: {
  restaurant_id: number;
  item_name: string;
  description: string;
  price: number;
  category: string;
  is_available?: boolean;
  image_url?: string;
}) => {
  const res = await axiosInstance.post('/menu-items', data);
  return res.data;
};

// ✅ Get all menu items of a restaurant
export const getMenuItemsByRestaurant = async (restaurantId: number) => {
  const res = await axiosInstance.get(`/menu-items/restaurant/${restaurantId}`);
  return res.data; // Items with liked: true/false if user logged in
};

// ✅ Update an existing menu item
export const updateMenuItem = async (
  itemId: number,
  data: {
    item_name?: string;
    description?: string;
    price?: number;
    category?: string;
    is_available?: boolean;
    image_url?: string;
  }
) => {
  const res = await axiosInstance.put(`/menu-items/${itemId}`, data);
  return res.data;
};

// ✅ Delete a menu item
export const deleteMenuItem = async (itemId: number) => {
  const res = await axiosInstance.delete(`/menu-items/${itemId}`);
  return res.data;
};

// ✅ Get most liked menu items (Top 10 globally)
export const getMostLikedItems = async () => {
  const res = await axiosInstance.get('/menu-items/popular');
  return res.data; // List of most liked items
};

// ✅ Get trending items (recent likes in last N days, default 7)
export const getTrendingItems = async (days = 7) => {
  const res = await axiosInstance.get(`/menu-items/trending?days=${days}`);
  return res.data; // List of trending items
};
