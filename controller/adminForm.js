
const bcrypt = require("bcryptjs");
const { constants } = require("crypto");
const jwt = require("jsonwebtoken");
const User = require('../model/User')

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
      message: "invalid Email or password",
    });
  }
  const adminToken = jwt.sign({
    email: email,
  },process.env.JWT_ADMIN);
  res.cookie('adminToken',adminToken)

  res.status(201).json({
    message:"Login compleated",
    success:true,
adminToken
  })
};

// view all users

const viewUsers = async(req,res) => {
  const user = await User.find()
  if(!user){
    return res.status(404).json({
      message:"Users is Empty"
    })
  }
  res.status(200).json({
    success:true,
    user
  })
}
module.exports = { adminLogin,viewUsers};
