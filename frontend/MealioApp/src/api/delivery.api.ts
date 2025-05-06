import axiosInstance from './axiosInstance';

// Assign a delivery personnel to an order (Admin/Restaurant)
export const assignDelivery = async (order_id: number, delivery_id: number) => {
  const res = await axiosInstance.post('/delivery/assign', {
    order_id,
    delivery_id,
  });
  return res.data; // Returns created assignment
};

// Update the current status of an assignment (picked_up / delivering / delivered)
export const updateAssignmentStatus = async (assignmentId: number, current_status: string) => {
  const res = await axiosInstance.put(`/delivery/${assignmentId}/status`, {
    current_status,
  });
  return res.data; // Returns { message, assignment }
};

// Delivery personnel log location update (optional backup to DB)
export const logDeliveryLocation = async (assignmentId: number, latitude: number, longitude: number) => {
  const res = await axiosInstance.post(`/delivery/${assignmentId}/location`, {
    latitude,
    longitude,
  });
  return res.data; // Returns created location log
};