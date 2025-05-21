// src/controllers/chat.controller.js
const db = require('../models');
const ChatRoom = db.ChatRoom;
const ChatMessage = db.ChatMessage;
const User = db.User;
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

exports.createOrGetRoom = async (req, res) => {
  try {
    const { user_two_id } = req.body;
    if (!user_two_id) {
      return res.status(400).json({ error: 'No target user specified' });
    }

    let chatRoom = await ChatRoom.findOne({
      where: {
        user_one_id: [req.user.user_id, user_two_id],
        user_two_id: [req.user.user_id, user_two_id]
      }
    });

    if (!chatRoom) {
      chatRoom = await ChatRoom.create({
        user_one_id: req.user.user_id,
        user_two_id
      });
    }

    return res.json(chatRoom);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating/getting chat room' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (req.user.role !== 'admin') {
      const room = await ChatRoom.findByPk(roomId);
      if (!room || (room.user_one_id !== req.user.user_id && room.user_two_id !== req.user.user_id)) {
        return res.status(403).json({ error: 'You are not a participant in this chat' });
      }
    }

    const messages = await ChatMessage.findAll({
      where: { chat_room_id: roomId },
      order: [['sent_at', 'ASC']]
    });

    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching messages' });
  }
};

exports.handleJoinRoom = (socket, chat_room_id) => {
  console.log(`User ${socket.userId} joining room ${chat_room_id}`);
  socket.join(chat_room_id);
};

exports.handleSendMessage = async (io, socket, data) => {
  try {
    const { chat_room_id, message_text } = data;

    const chatRoom = await ChatRoom.findByPk(chat_room_id);
    if (!chatRoom) {
      return socket.emit('error', { error: 'Invalid chat room' });
    }

    // Save message in DB
    const newMessage = await ChatMessage.create({
      chat_room_id,
      sender_id: socket.userId,
      message_text,
    });

    // Emit to users in the chat room
    io.to(chat_room_id).emit('receive_message', newMessage);

    // Push Notification to the other user
    const otherUserId = (chatRoom.user_one_id === socket.userId) ? chatRoom.user_two_id : chatRoom.user_one_id;
    const recipient = await User.findByPk(otherUserId);

    if (recipient && recipient.push_token && Expo.isExpoPushToken(recipient.push_token)) {
      await expo.sendPushNotificationsAsync([
        {
          to: recipient.push_token,
          sound: 'default',
          title: 'New Message',
          body: message_text.length > 100 ? message_text.substring(0, 100) + '...' : message_text,
          data: { chat_room_id },
        }
      ]);
    }

  } catch (error) {
    console.error('Socket send message error:', error);
    socket.emit('error', { error: 'Error sending message' });
  }
};

exports.handleTyping = (io, socket, data) => {
  const { chat_room_id } = data;
  io.to(chat_room_id).emit('typing', { userId: socket.userId });
};

exports.handleStopTyping = (io, socket, data) => {
  const { chat_room_id } = data;
  io.to(chat_room_id).emit('stop_typing', { userId: socket.userId });
};