import axiosInstance from './axiosInstance';

// ✅ Like a menu item
export const likeMenuItem = async (item_id: number) => {
  const res = await axiosInstance.post('/menu-item/like', { item_id });
  return res.data; // { message: 'Liked' or 'Already liked', like }
};

// ✅ Unlike a menu item
export const unlikeMenuItem = async (item_id: number) => {
  const res = await axiosInstance.delete(`/menu-item/unlike/${item_id}`);
  return res.data; // { message: 'Unliked' or 'Not previously liked' }
};

// ✅ Get all my liked items (for the logged-in user)
export const getMyLikedMenuItems = async () => {
  const res = await axiosInstance.get('/menu-item/my-likes');
  return res.data; // Array of liked menu items
};

// ✅ Get like count of a particular item (public)
export const getMenuItemLikeCount = async (item_id: number) => {
  const res = await axiosInstance.get(`/menu-item/${item_id}/like-count`);
  return res.data; // { item_id, like_count }
};
