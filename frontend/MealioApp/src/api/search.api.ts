import axios from 'axios';
import { Platform } from 'react-native';

const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const BASE = `http://${HOST}:3001/api/search`;

export const searchItems = async (
  q: string,
  page = 1,
  limit = 10
): Promise<{ count: number; rows: any[] }> => {
  const { data } = await axios.get(`${BASE}/items`, {
    params: { q, page, limit }
  });
  return data;
};

export const searchRestaurants = async (
  q: string,
  page = 1,
  limit = 10
): Promise<{ count: number; rows: any[] }> => {
  const { data } = await axios.get(`${BASE}/restaurants`, {
    params: { q, page, limit }
  });
  return data;
};
