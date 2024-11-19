const express = require("express");
const router = express.Router();
const { checkRole } = require("../services/jwt");

const {
  createOrder,
  getUserOrders,
  getTotalOrders,
  deleteOrder,
  updateOrder,
  getTotalSales,
  getAllOrders,
} = require("../controllers/orders.controller");

router.post("/", createOrder);
router.get("/", checkRole("admin"), getAllOrders);
router.get("/get/userorders/:userId", getUserOrders);
router.get("/get/count", checkRole("admin"), getTotalOrders);
router.put("/orderId", checkRole("admin"), updateOrder);
router.get("/get/totalsales", checkRole("admin"), getTotalSales);
router.delete("/orderId", checkRole("admin"), deleteOrder);

module.exports = router;
