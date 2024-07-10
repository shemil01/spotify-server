const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  mobileNumber: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

const Otp = mongoose.model("Otp", otpSchema);
