const express = require("express");
const userRoutes = express.Router();
const controller = require("../controller/userForm");
const userAuth = require("../middleware/userAuth");
const { tryCatch } = require("../utils/tryCatch");
const { uploadFiles } = require("../middleware/cloudinary")

userRoutes.post("/user/register", tryCatch(controller.userRegiser));
userRoutes.post("/user/email-check",tryCatch(controller.emailExist))
userRoutes.post("/user/login", tryCatch(controller.userLogin));
userRoutes.post("/google-login", tryCatch(controller.googleLogin));
userRoutes.post("/password-reset",tryCatch(controller.forgotPassword))
userRoutes.post("/reset/:token",tryCatch(controller.passwordSave))
userRoutes.get("/user/view-profail",userAuth,tryCatch(controller.viewProfail))
userRoutes.put('/user/edit-profail',userAuth,uploadFiles,tryCatch(controller.editProfaile))
// userRoutes.post('/send-otp',tryCatch(controller.sendOtp))
// userRoutes.post('/verify-otp',tryCatch(controller.verifyOtp))

module.exports = userRoutes;

