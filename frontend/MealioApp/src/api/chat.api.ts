// src/api/chat.api.ts
import axiosInstance from './axiosInstance';

// Create or Get existing Chat Room
export const createOrGetChatRoom = async (user_two_id: number) => {
  const res = await axiosInstance.post('/chat/room', { user_two_id });
  return res.data; // { chat_room_id, user_one_id, user_two_id }
};

// Fetch all Messages of a Chat Room
export const getMessages = async (chat_room_id: number) => {
  const res = await axiosInstance.get(`/chat/${chat_room_id}/messages`);
  return res.data; // [ { message_id, sender_id, message_text, sent_at } ]
};
