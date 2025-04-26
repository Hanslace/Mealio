const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const MenuItem = db.MenuItem;
const Payment = db.Payment;

module.exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      address_id,
      restaurant_id,
      coupon_id,
      payment_method,     // 'cod' or 'online'
      transaction_id      // required if online
    } = req.body;

    if (!payment_method || !['cod', 'online'].includes(payment_method)) {
      return res.status(400).json({ error: 'Invalid or missing payment_method' });
    }

    // Validate & calculate total
    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.item_id);
      if (!menuItem) {
        return res.status(400).json({ error: `Item ${item.item_id} not found.` });
      }
      totalAmount += menuItem.price * item.quantity;
    }

    // Create order
    const newOrder = await Order.create({
      user_id: req.user.user_id,
      restaurant_id,
      address_id,
      coupon_id: coupon_id || null,
      total_amount: totalAmount,
      net_amount: totalAmount,
      order_status: payment_method === 'cod' ? 'placed' : 'waiting_for_payment'
    });

    // Create order_items
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.item_id);
      await OrderItem.create({
        order_id: newOrder.order_id,
        item_id: menuItem.item_id,
        quantity: item.quantity,
        item_price_at_purchase: menuItem.price
      });
    }

    // Create payment record
    const payment = await Payment.create({
      order_id: newOrder.order_id,
      amount_paid: payment_method === 'cod' ? 0 : totalAmount,
      payment_method,
      payment_status: 'pending',
      transaction_id: payment_method === 'online' ? transaction_id || null : null
    });

    return res.status(201).json({ order: newOrder, payment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating order' });
  }
};

module.exports.getMyOrders = async (req, res) => {
  try {
    let whereClause = {};

    // If not admin, filter by current user's ID
    if (req.user.role !== 'admin') {
      whereClause.user_id = req.user.user_id;
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [ OrderItem ]
    });

    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching orders' });
  }
};
