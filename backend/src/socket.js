const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('./models');
const User = db.User;
const chatController = require('./controllers/chat.controller');

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // ⚠️ Allow all origins for now
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.user_id;
      next();
    } catch (err) {
      console.error('Socket auth error:', err);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
  console.log('⚡ User connected: ', socket.id);

  User.update({ is_online: true }, { where: { user_id: socket.userId } });

  socket.join(`user_${socket.userId}`);

  socket.on('join_room', (chat_room_id) => chatController.handleJoinRoom(socket, chat_room_id));
  socket.on('send_message', (data) => chatController.handleSendMessage(io, socket, data));
  socket.on('typing', (data) => chatController.handleTyping(io, socket, data));
  socket.on('stop_typing', (data) => chatController.handleStopTyping(io, socket, data));

  socket.on('disconnect', async () => {
    console.log(`⚡ User disconnected: ${socket.id}`);
    await User.update(
      { is_online: false, last_seen: new Date() },
      { where: { user_id: socket.userId } }
    );
  });
});


module.exports = setupSocket;
