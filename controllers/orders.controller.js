const mongoose = require("mongoose");
const { CustomError } = require("../services/errorHandler");
const Product = require("../models/products.model");
const Order = require("../models/orders.model");
const OrderItem = require("../models/orderitem.model");

async function createOrder(req, res, next) {
  try {
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );
    const orderItemsIdsResolved = await orderItemsIds;
    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    const order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });
    await order.save();
    const createdOrder = await Order.findOne({ _id: order._id }).populate({
      path: "orderItems",
      populate: {
        path: "product",
        model: "product",
      },
    });

    return res.status(200).json({ success: true, createdOrder });
  } catch (error) {
    next(error);
  }
}
async function getUserOrders(req, res) {
  try {
    const { userId } = req.params;
    const userOrders = await Order.find({ user: userId })
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      })
      .sort({ dateOrdered: -1 });
    res.status(200).json({ success: true, userOrders });
  } catch (error) {
    next(error);
  }
}
async function getTotalOrders(req, res) {
  try {
    const ordersCount = await Order.countDocuments();
    return res.status(200).json({ "no of orders": ordersCount });
  } catch (error) {
    next(error);
  }
}
async function deleteOrder(req, res) {
  const { orderId } = req.params;
  try {
    const order = await Order.findByIdAndDelete(orderId);
    await order.orderItems.map(async (orderItem) => {
      await OrderItem.findByIdAndDelete(orderItem);
    });
    res.status(200).json({ message: "order successfully deleted" });

    const ordersCount = await Order.countDocuments();
    return res.status(200).json({ "no of orders": ordersCount });
  } catch (error) {
    next(error);
  }
}
async function updateOrder(req, res) {
  const { orderId } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

async function getTotalSales(req, res) {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);

    res.status(200).json({ "total sales": totalSales.pop().totalSales });
  } catch (error) {
    next(error);
  }
}
async function getAllOrders(req, res) {
  try {
    const orders = await Order.find({})
      .populate("user", "name")
      .sort({ dateOrdered: -1 });
    res.status(200).json({ "number of orders": orders.length, orders });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getTotalOrders,
  deleteOrder,
  updateOrder,
  getTotalSales,
  getAllOrders,
};
