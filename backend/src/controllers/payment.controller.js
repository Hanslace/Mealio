const db = require('../models');
const Payment = db.Payment;
const Order = db.Order;


/**
 * Confirm payment via webhook or manual gateway verification
 */
module.exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { payment_status } = req.body; // 'completed' | 'failed'

    const payment = await Payment.findByPk(paymentId);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    payment.payment_status = payment_status;
    await payment.save();

    const order = await Order.findByPk(payment.order_id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (payment_status === 'completed') {
      order.order_status = 'preparing';
    } else if (payment_status === 'failed') {
      order.order_status = 'canceled';
    }

    await order.save();

    return res.json({ message: 'Payment status updated', payment, order });
  } catch (err) {
    next(err);
  }
};

/**
 * Webhook (no auth) — for gateway callback
 */
module.exports.paymentWebhook = async (req, res, next) => {
  try {
    const { order_id, payment_status, transaction_id } = req.body;

    const payment = await Payment.findOne({ where: { transaction_id } });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    payment.payment_status = payment_status;
    await payment.save();

    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (payment_status === 'completed') {
      order.order_status = 'preparing';
    } else if (payment_status === 'failed') {
      order.order_status = 'canceled';
    }

    await order.save();
    return res.status(200).json({ message: 'Webhook processed' });
  } catch (err) {
    next(err);
  }
};

/**
 * Confirm Cash on Delivery payment manually (by admin/staff)
 */
module.exports.confirmCashPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findByPk(paymentId);
    if (!payment || payment.payment_method !== 'cod') {
      return res.status(404).json({ error: 'COD payment not found' });
    }

    payment.payment_status = 'completed';
    await payment.save();

    const order = await Order.findByPk(payment.order_id);
    if (order) {
      order.order_status = 'delivered'; // or 'delivered'
      await order.save();
    }

    return res.json({ message: 'COD payment confirmed', payment, order });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark COD as failed (customer didn't pay)
 */
module.exports.failCashPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findByPk(paymentId);
    if (!payment || payment.payment_method !== 'cod') {
      return res.status(404).json({ error: 'COD payment not found' });
    }

    payment.payment_status = 'failed';
    await payment.save();

    const order = await Order.findByPk(payment.order_id);
    if (order) {
      order.order_status = 'canceled'; // or 'canceled'
      await order.save();
    }

    return res.json({ message: 'COD payment marked as failed', payment, order });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all payments for an order
 */
module.exports.getPaymentsForOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const payments = await Payment.findAll({ where: { order_id: orderId } });
    return res.json(payments);
  } catch (err) {
    next(err);
  }
};
