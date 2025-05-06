import axiosInstance from './axiosInstance';

// ✅ Confirm online payment (admin/staff dashboard)
export const confirmPayment = async (paymentId: number, payment_status: 'completed' | 'failed') => {
  const res = await axiosInstance.put(`/payment/${paymentId}/confirm`, { payment_status });
  return res.data; // { message, payment, order }
};

// ✅ Confirm COD payment manually (admin/staff)
export const confirmCashPayment = async (paymentId: number) => {
  const res = await axiosInstance.put(`/payment/${paymentId}/confirm-cash`);
  return res.data; // { message, payment, order }
};

// ✅ Fail COD payment manually (admin/staff)
export const failCashPayment = async (paymentId: number) => {
  const res = await axiosInstance.put(`/payment/${paymentId}/fail-cash`);
  return res.data; // { message, payment, order }
};

// ✅ Get all payments related to a particular order
export const getPaymentsForOrder = async (orderId: number) => {
  const res = await axiosInstance.get(`/payment/order/${orderId}`);
  return res.data; // array of payments
};

// 🔔 Webhook (No auth needed, called by payment gateway like Stripe or local provider)
export const paymentWebhook = async (payload: {
  order_id: number;
  payment_status: 'completed' | 'failed';
  transaction_id: string;
}) => {
  const res = await axiosInstance.post('/payment/webhook', payload);
  return res.data; // { message }
};
