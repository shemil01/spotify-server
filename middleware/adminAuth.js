const jwt = require("jsonwebtoken");
const adminSchema = require("../model/AdminSchema");
const { tryCatch } = require("../utils/tryCatch");

const adminAuth = tryCatch(async (req, res, next) => {
  const { adminToken } = req.cookies;
  if (!adminToken) {  
    return res.status(401).json({
      success: false,
      message: "Unauthorized, token is missing",
    });
  }
  
  const decoded = jwt.verify(adminToken, process.env.JWT_ADMIN);
  console.log("f",decoded)

  const admin = await adminSchema.findById(decoded.id);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Not an admin",
    });
  }

  req.admin = admin;
  next();
});

module.exports = adminAuth;
