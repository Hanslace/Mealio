import axiosInstance from './axiosInstance';

// ✅ Create a new order
export const createOrder = async (orderData: {
  items: { item_id: number; quantity: number }[];
  address_id: number;
  restaurant_id: number;
  coupon_id?: number;
  payment_method: 'cod' | 'online';
  transaction_id?: string;
}) => {
  const res = await axiosInstance.post('/orders', orderData);
  return res.data; // { order, payment }
};

// ✅ Get my orders (user, restaurant owner, or admin)
export const getMyOrders = async () => {
  const res = await axiosInstance.get('/orders');
  return res.data; // Array of order objects
};
