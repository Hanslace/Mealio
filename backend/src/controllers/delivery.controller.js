// src/controllers/delivery.controller.js
const db = require('../models');
const DeliveryAssignment = db.DeliveryAssignment;
const DeliveryLocationLog = db.DeliveryLocationLog;
const Order = db.Order;
const DeliveryPersonnel = db.DeliveryPersonnel;

//autmate the assignment
module.exports.assignDelivery = async (req, res) => {
  try {
    const { order_id, delivery_id } = req.body;
    // check if the order is valid
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // check if the delivery person is valid
    const deliveryPerson = await DeliveryPersonnel.findByPk(delivery_id);
    if (!deliveryPerson) {
      return res.status(404).json({ error: 'Delivery personnel not found' });
    }

    // create assignment
    const assignment = await DeliveryAssignment.create({
      order_id,
      delivery_id,
      current_status: 'assigned'
    });

    // Optionally, update order status to out_for_delivery or something as needed
    // ...

    return res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error assigning delivery' });
  }
};

/**
 * Delivery person updates assignment status
 * (picked_up, delivering, delivered, etc.)
 */
module.exports.updateAssignmentStatus = async (req, res) => {
  try {
    // Only the assigned delivery person or admin can update
    const { assignmentId } = req.params;
    const { current_status } = req.body;
    const assignment = await DeliveryAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // check if current user is the assigned delivery personnel or admin
    const deliveryPerson = await DeliveryPersonnel.findOne({ 
      where: { user_id: req.user.user_id } 
    });
    if (req.user.role !== 'admin') {
      // user must be the assigned delivery person
      if (!deliveryPerson || deliveryPerson.delivery_id !== assignment.delivery_id) {
        return res.status(403).json({ error: 'You are not assigned to this order' });
      }
    }

    assignment.current_status = current_status;
    await assignment.save();
    return res.json({ message: 'Delivery status updated', assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating delivery status' });
  }
};

/**
 * Delivery person logs current location
 */
module.exports.logLocation = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { latitude, longitude } = req.body;

    // check if the assignment is valid and belongs to the current user if not admin
    const assignment = await DeliveryAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (req.user.role !== 'admin') {
      const deliveryPerson = await DeliveryPersonnel.findOne({ 
        where: { user_id: req.user.user_id } 
      });
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

/**
 * (Optional) Get location logs for an assignment
 * Admin or the assigned delivery person might want to see it.
 */
module.exports.getLocationLogs = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // only admin or assigned delivery person
    if (req.user.role !== 'admin') {
      const deliveryPerson = await DeliveryPersonnel.findOne({ 
        where: { user_id: req.user.user_id } 
      });
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
