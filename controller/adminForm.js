
const bcrypt = require("bcryptjs");
const { constants } = require("crypto");
const jwt = require("jsonwebtoken");

//admin login
const adminLogin = async (req, res) => {
  const admin = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  };
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const validation = email === admin.email && password === admin.password;

  if (!validation) {
    res.status(400).json({
      success: false,
      message: "Email or password or in correct",
    });
  }
  const adminToken = jwt.sign({
    email: email,
  },process.env.JWT_ADMIN);
  res.cookie('adminToken',adminToken)

  res.status(201).json({
    message:"Login compleated",
    success:true,

  })
};

// view user
module.exports = { adminLogin};
