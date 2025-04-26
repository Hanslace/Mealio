// src/controllers/chat.controller.js
const db = require('../models');
const ChatRoom = db.ChatRoom;
const ChatMessage = db.ChatMessage;

module.exports.createOrGetRoom = async (req, res) => {
  try {
    // user_one = current user, user_two = target
    const { user_two_id } = req.body;
    if (!user_two_id) {
      return res.status(400).json({ error: 'No target user specified' });
    }

    // Find or create the room
    let chatRoom = await ChatRoom.findOne({
      where: {
        user_one_id: [req.user.user_id, user_two_id],
        user_two_id: [req.user.user_id, user_two_id]
      }
    });

    if (!chatRoom) {
      // not found, create
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

module.exports.sendMessage = async (req, res) => {
  try {
    const { chat_room_id, message_text } = req.body;
    const newMessage = await ChatMessage.create({
      chat_room_id,
      sender_id: req.user.user_id,
      message_text
    });
    return res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error sending message' });
  }
};

module.exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Check if the user is part of the chat (if not admin)
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

