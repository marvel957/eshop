const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  order: {
    type: mongoose.Types.ObjectId,
    ref: "order",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: { type: String },
  paymentId: { type: String, required: true },
  status: {
    type: String,
    default: "FAILED",
  },
  // refund:{
  //     type:mongoose.Types.ObjectId,
  //     ref:'user',

  // }
});

module.exports = paymentSchema;
