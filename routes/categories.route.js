const express = require("express");
const { checkRole } = require("../services/jwt");

const router = express.Router();
const {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");

router.post("/", checkRole("admin"), createCategory);
router.get("/", getAllCategory);
router.get("/:categoryId", getSingleCategory);
router.put("/:categoryId", checkRole("admin"), updateCategory);
router.delete("/:categoryId", checkRole("admin"), deleteCategory);

module.exports = router;
