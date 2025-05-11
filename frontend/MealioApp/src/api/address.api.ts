// src/api/address.api.ts
import axiosInstance from './axiosInstance';

// Create new address
export const createAddress = async (data: {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
}) => {
  const res = await axiosInstance.post('/addresses', data);
  return res.data;
};

// Get all my addresses
export const getMyAddresses = async () => {
  const res = await axiosInstance.get('/addresses');
  return res.data;
};

// Update an address
export const updateAddress = async (addressId: number, data: {
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
}) => {
  const res = await axiosInstance.put(`/addresses/${addressId}`, data);
  return res.data;
};

// Delete an address
export const deleteAddress = async (addressId: number) => {
  const res = await axiosInstance.delete(`/addresses/${addressId}`);
  return res.data;
};
