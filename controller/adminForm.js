const bcrypt = require("bcryptjs");
const { constants } = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Song = require("../model/SongSchema");
const Admin = require("../model/AdminSchema");

//admin login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Email is incorrect",
    });
  }
  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    return res.status(403).send("Incorrect password");
  }

  const adminToken = jwt.sign(
    {
      id: admin._id,
    },
    process.env.JWT_ADMIN
  );
  res.cookie("adminToken", adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // or 'lax' if you're using the same domain
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(201).json({
    message: "Login compleated",
    success: true,
    adminToken,
  });
};

// view all users

const viewUsers = async (req, res) => {
  const user = await User.find();
  if (!user) {
    return res.status(404).json({
      message: "Users is Empty",
    });
  }
  res.status(200).json({
    success: true,
    user,
  });
};

module.exports = { adminLogin, viewUsers };
