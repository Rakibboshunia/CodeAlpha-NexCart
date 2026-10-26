const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Update product stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.name} not found`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  res.status(201).json({ success: true, data: order });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Users can only see their own orders (admins can see all)
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, data: order });
});

// @desc    Get logged-in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    updateTime: req.body.update_time,
    email: req.body.payer?.email_address,
  };
  order.orderStatus = 'Processing';

  const updatedOrder = await order.save();
  res.json({ success: true, data: updatedOrder });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
    res.status(400);
    throw new Error('Cannot cancel a shipped or delivered order');
  }

  // Restore stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      product.sold -= item.quantity;
      await product.save();
    }
  }

  order.orderStatus = 'Cancelled';
  await order.save();
  res.json({ success: true, message: 'Order cancelled successfully' });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = req.body.status;
  if (req.body.status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  if (req.body.trackingNumber) {
    order.trackingNumber = req.body.trackingNumber;
  }

  const updatedOrder = await order.save();
  res.json({ success: true, data: updatedOrder });
});

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
