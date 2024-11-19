const express = require("express");
const router = express.Router();
const { validateUserInputs } = require("../services/validateInputs");

const {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  getUserCount,
} = require("../controllers/users.controller");

router.post("/register", validateUserInputs, createUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:userId", getUser);
router.get("/get/count", getUserCount);

module.exports = router;
