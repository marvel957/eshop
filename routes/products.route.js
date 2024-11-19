const express = require("express");
const router = express.Router();
const { checkRole } = require("../services/jwt");
const upload = require("../services/uploads");

// const { validateProduct } = require("../services/validateInputs");
const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  totalProducts,
} = require("../controllers/products.controller");

router.post("/", checkRole("admin"), upload, createProduct);
router.get("/", getProducts);
router.get("/:productId", getSingleProduct);
router.put("/:productId", checkRole("admin"), updateProduct);
router.delete("/:productId", checkRole("admin"), deleteProduct);
router.get("/get/count", checkRole("admin"), totalProducts);

module.exports = router;
