// src/api/search.api.ts
import axiosInstance from './axiosInstance';

const BASE = '/search';

export interface SearchResult<T> {
  count: number;
  rows: T[];
}

export const searchItems = async (
  q: string,
  page = 1,
  limit = 10
): Promise<SearchResult<any>> => {
  const { data } = await axiosInstance.get<SearchResult<any>>(
    `${BASE}/items`,
    { params: { q, page, limit } }
  );
  return data;
};

export const searchRestaurants = async (
  q: string,
  page = 1,
  limit = 10
): Promise<SearchResult<any>> => {
  const { data } = await axiosInstance.get<SearchResult<any>>(
    `${BASE}/restaurants`,
    { params: { q, page, limit } }
  );
  return data;
};
