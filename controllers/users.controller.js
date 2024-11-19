const express = require("express");
const User = require("../models/users.model.js");
const { CustomError } = require("../services/errorHandler");
const { generateToken } = require("../services/jwt.js");

const app = express();
app.use(express.json());
// create user
async function createUser(req, res, next) {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      isAdmin,
      street,
      appartment,
      zip,
      city,
      country,
    } = req.body;
    const existingUser = User.findOne({ email: req.body.email });
    if (existingUser) {
      throw new CustomError("User already exists", 409);
    }
    const user = new User({
      username,
      email,
      passwordHash: password,
      firstName,
      lastName,
      phone,
      isAdmin,
      street,
      appartment,
      zip,
      city,
      country,
    });
    user.isAdmin = false;
    await user.save();
    const response = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      response,
    });
  } catch (error) {
    next(error);
  }
}

//route to login/authenticating a user
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomError("invalid credentials", 401);
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("invalid credentials", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new CustomError("invalid credentials", 401);
    }

    const token = generateToken(user);

    return res.status(201).json({ user: user.email, token: token });
  } catch (error) {
    next(error);
  }
}
// get all users controller
async function getAllUsers(req, res) {
  try {
    const userList = await User.find({}).select("-passwordHash");
    return res.status(200).json({ success: true, users: userList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// get all users controller
async function getUser(req, res) {
  try {
    const userList = await User.find({}).select("-passwordHash");
    return res.status(200).json({ success: true, users: userList });
  } catch (error) {
    next(error);
  }
}
async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-passwordHash");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}
async function getUserCount(req, res) {
  try {
    const usercount = await User.countDocuments();
    return res
      .status(200)
      .json({ success: true, "amount of users": usercount });
  } catch (error) {
    next(error);
  }
}
module.exports = { createUser, loginUser, getAllUsers, getUser, getUserCount };
