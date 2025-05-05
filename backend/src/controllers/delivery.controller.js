const db = require('../models');
const DeliveryAssignment = db.DeliveryAssignment;
const DeliveryLocationLog = db.DeliveryLocationLog;
const Order = db.Order;
const DeliveryPersonnel = db.DeliveryPersonnel;
const Restaurant = db.Restaurant;
const User = db.User;
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

// Assign a delivery personnel
exports.assignDelivery = async (req, res) => {
  try {
    const { order_id, delivery_id } = req.body;

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const deliveryPerson = await DeliveryPersonnel.findByPk(delivery_id);
    if (!deliveryPerson) {
      return res.status(404).json({ error: 'Delivery personnel not found' });
    }

    const assignment = await DeliveryAssignment.create({
      order_id,
      delivery_id,
      current_status: 'assigned'
    });

    return res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error assigning delivery' });
  }
};

// Update delivery assignment status (picked_up, delivered, etc.)
exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { current_status } = req.body;

    const assignment = await DeliveryAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const deliveryPerson = await DeliveryPersonnel.findOne({ where: { user_id: req.user.user_id } });
    if (req.user.role !== 'admin') {
      if (!deliveryPerson || deliveryPerson.delivery_id !== assignment.delivery_id) {
        return res.status(403).json({ error: 'You are not assigned to this order' });
      }
    }

    assignment.current_status = current_status;
    await assignment.save();

    // Emit real-time status update
    const io = req.app.get('io');
    io.to(`assignment_${assignmentId}`).emit('status_update', { assignment_id: assignmentId, current_status });

    // Push Notification to Customer + Restaurant Owner
    const order = await Order.findByPk(assignment.order_id);
    const customer = await User.findByPk(order.user_id);
    const restaurant = await Restaurant.findByPk(order.restaurant_id);
    const owner = await User.findByPk(restaurant.user_id);

    const pushTokens = [];
    if (customer?.push_token) pushTokens.push(customer.push_token);
    if (owner?.push_token) pushTokens.push(owner.push_token);

    if (pushTokens.length > 0) {
      await expo.sendPushNotificationsAsync(pushTokens.map(token => ({
        to: token,
        sound: 'default',
        title: 'Order Update',
        body: `Order status changed to ${current_status}`,
        data: { assignment_id: assignment.assignment_id },
      })));
    }

    return res.json({ message: 'Delivery status updated', assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating delivery status' });
  }
};

// Quietly log location in DB (optional backup)
exports.logLocation = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { latitude, longitude } = req.body;

    const assignment = await DeliveryAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (req.user.role !== 'admin') {
      const deliveryPerson = await DeliveryPersonnel.findOne({ where: { user_id: req.user.user_id } });
      if (!deliveryPerson || deliveryPerson.delivery_id !== assignment.delivery_id) {
        return res.status(403).json({ error: 'You are not assigned to this order' });
      }
    }

    const logEntry = await DeliveryLocationLog.create({
      assignment_id: assignmentId,
      latitude,
      longitude
    });

    return res.status(201).json(logEntry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error logging location' });
  }
};

// Fetch location logs (for admin, optional)
exports.getLocationLogs = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await DeliveryAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (req.user.role !== 'admin') {
      const deliveryPerson = await DeliveryPersonnel.findOne({ where: { user_id: req.user.user_id } });
      if (!deliveryPerson || deliveryPerson.delivery_id !== assignment.delivery_id) {
        return res.status(403).json({ error: 'You are not assigned to this order' });
      }
    }

    const logs = await DeliveryLocationLog.findAll({
      where: { assignment_id: assignmentId },
      order: [['captured_at', 'ASC']]
    });

    return res.json(logs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching location logs' });
  }
};
