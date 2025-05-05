const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const MenuItem = db.MenuItem;
const Payment = db.Payment;
const Coupon = db.Coupon; // 👈 Import Coupon model

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
      if (menuItem.restaurant_id !== restaurant_id) {
        return res.status(400).json({ error: `Item ${item.item_id} does not belong to this restaurant.` });
      }
      totalAmount += menuItem.price * item.quantity;
    }

    let discountAmount = 0;

    // 🔥 Handle Coupon if provided
    if (coupon_id) {
      const coupon = await Coupon.findByPk(coupon_id);

      if (!coupon) {
        return res.status(400).json({ error: 'Invalid coupon.' });
      }

      if (coupon.restaurant_id !== restaurant_id) {
        return res.status(400).json({ error: 'Coupon not valid for this restaurant.' });
      }

      const today = new Date();
      if (today < new Date(coupon.valid_from) || today > new Date(coupon.valid_until)) {
        return res.status(400).json({ error: 'Coupon expired or not active.' });
      }

      if (coupon.usage_limit > 0 && coupon.times_used >= coupon.usage_limit) {
        return res.status(400).json({ error: 'Coupon usage limit reached.' });
      }

      // Calculate discount
      if (coupon.discount_type === 'percentage') {
        discountAmount = (totalAmount * coupon.discount_value) / 100;

        const MAX_DISCOUNT = 500; // 👈 Set a maximum cap (PKR 500 for example)
        if (discountAmount > MAX_DISCOUNT) {
          discountAmount = MAX_DISCOUNT;
        }
      } else if (coupon.discount_type === 'fixed') {
        discountAmount = coupon.discount_value;
      }
    }

    const netAmount = totalAmount - discountAmount;

    // Create Order
    const newOrder = await Order.create({
      user_id: req.user.user_id,
      restaurant_id,
      address_id,
      coupon_id: coupon_id || null,
      total_amount: totalAmount,
      discount_amount: discountAmount,
      net_amount: netAmount,
      order_status: payment_method === 'cod' ? 'placed' : 'waiting_for_payment'
    });

    // Create Order Items
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.item_id);
      await OrderItem.create({
        order_id: newOrder.order_id,
        item_id: menuItem.item_id,
        quantity: item.quantity,
        item_price_at_purchase: menuItem.price
      });
    }

    // Create Payment Record
    const payment = await Payment.create({
      order_id: newOrder.order_id,
      amount_paid: payment_method === 'cod' ? 0 : netAmount,
      payment_method,
      payment_status: 'pending',
      transaction_id: payment_method === 'online' ? transaction_id || null : null
    });

    // 🔥 Update coupon usage if coupon used
    if (coupon_id) {
      const coupon = await Coupon.findByPk(coupon_id);
      coupon.times_used += 1;
      await coupon.save();
    }

    return res.status(201).json({ order: newOrder, payment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating order' });
  }
};

module.exports.getMyOrders = async (req, res) => {
  try {
    let whereClause = {};

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
