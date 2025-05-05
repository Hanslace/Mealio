const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('./models');
const User = db.User;
const chatController = require('./controllers/chat.controller');
const DeliveryAssignment = db.DeliveryAssignment;
const DeliveryLocationLog = db.DeliveryLocationLog;
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // Allow all for now
      methods: ['GET', 'POST'],
    },
  });

  // Socket.IO Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.user_id; // Attach userId
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log('⚡ User connected:', socket.id);

    try {
      await User.update({ is_online: true }, { where: { user_id: socket.userId } });
    } catch (error) {
      console.error('Error setting user online:', error);
    }

    // Automatically join user's notification room
    socket.join(`user_${socket.userId}`);

    // ===== 💬 CHAT EVENTS =====
    socket.on('join_room', (chat_room_id) => {
      try {
        chatController.handleJoinRoom(socket, chat_room_id);
      } catch (error) {
        console.error('join_room error:', error);
      }
    });

    socket.on('send_message', (data) => {
      try {
        chatController.handleSendMessage(io, socket, data);
      } catch (error) {
        console.error('send_message error:', error);
      }
    });

    socket.on('typing', (data) => {
      try {
        chatController.handleTyping(io, socket, data);
      } catch (error) {
        console.error('typing error:', error);
      }
    });

    socket.on('stop_typing', (data) => {
      try {
        chatController.handleStopTyping(io, socket, data);
      } catch (error) {
        console.error('stop_typing error:', error);
      }
    });

    // ===== 🛵 DELIVERY EVENTS =====
    socket.on('join_assignment', (assignment_id) => {
      try {
        console.log(`User ${socket.userId} joined assignment_${assignment_id}`);
        socket.join(`assignment_${assignment_id}`);
      } catch (error) {
        console.error('join_assignment error:', error);
      }
    });

    socket.on('leave_assignment', (assignment_id) => {
      try {
        console.log(`User ${socket.userId} left assignment_${assignment_id}`);
        socket.leave(`assignment_${assignment_id}`);
      } catch (error) {
        console.error('leave_assignment error:', error);
      }
    });

    socket.on('location_update', async (data) => {
      try {
        const { assignment_id, latitude, longitude } = data;

        // Save in database (optional but professional)
        await DeliveryLocationLog.create({
          assignment_id,
          latitude,
          longitude,
        });

        // Emit real-time to assignment room
        io.to(`assignment_${assignment_id}`).emit('location_update', { latitude, longitude });
      } catch (error) {
        console.error('location_update error:', error);
      }
    });

    socket.on('status_update', async (data) => {
      try {
        const { assignment_id, current_status } = data;

        // Update in database (optional backup)
        const assignment = await DeliveryAssignment.findByPk(assignment_id);
        if (assignment) {
          assignment.current_status = current_status;
          await assignment.save();
        }

        // Emit real-time to assignment room
        io.to(`assignment_${assignment_id}`).emit('status_update', { assignment_id, current_status });

        // Push Notification to Customer and Owner
        const order = await db.Order.findByPk(assignment.order_id);
        const customer = await db.User.findByPk(order.user_id);
        const restaurant = await db.Restaurant.findByPk(order.restaurant_id);
        const owner = await db.User.findByPk(restaurant.user_id);

        const pushTokens = [];
        if (customer?.push_token) pushTokens.push(customer.push_token);
        if (owner?.push_token) pushTokens.push(owner.push_token);

        if (pushTokens.length > 0) {
          await expo.sendPushNotificationsAsync(pushTokens.map(token => ({
            to: token,
            sound: 'default',
            title: 'Order Update',
            body: `Order status changed to ${current_status}`,
            data: { assignment_id },
          })));
        }
      } catch (error) {
        console.error('status_update error:', error);
      }
    });

    // ===== 🔌 DISCONNECT =====
    socket.on('disconnect', async () => {
      console.log('⚡ User disconnected:', socket.id);

      try {
        await User.update(
          { is_online: false, last_seen: new Date() },
          { where: { user_id: socket.userId } }
        );
      } catch (error) {
        console.error('Error setting user offline:', error);
      }
    });
  });

  return io;
}

module.exports = setupSocket;
