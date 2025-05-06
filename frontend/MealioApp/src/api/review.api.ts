import axiosInstance from './axiosInstance';

// ✅ Create a new review
export const createReview = async (payload: {
  restaurant_id: number;
  rating: number;
  comment: string;
}) => {
  const res = await axiosInstance.post('/review', payload);
  return res.data; // returns created review
};

// ✅ Get all reviews for a specific restaurant
export const getReviewsForRestaurant = async (restaurantId: number) => {
  const res = await axiosInstance.get(`/review/restaurant/${restaurantId}`);
  return res.data; // returns array of reviews
};

// ✅ Update a specific review (must be your own unless admin)
export const updateReview = async (reviewId: number, payload: {
  rating?: number;
  comment?: string;
}) => {
  const res = await axiosInstance.put(`/review/${reviewId}`, payload);
  return res.data; // returns updated review
};

// ✅ Delete a specific review (must be your own unless admin)
export const deleteReview = async (reviewId: number) => {
  const res = await axiosInstance.delete(`/review/${reviewId}`);
  return res.data; // returns success message
};
