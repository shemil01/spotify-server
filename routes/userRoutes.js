const express = require("express");
const userRoutes = express.Router();
const controller = require("../controller/userForm");
const userAuth = require("../middleware/userAuth");
const { tryCatch } = require("../utils/tryCatch");

userRoutes.post("/user/register", tryCatch(controller.userRegiser));
userRoutes.post("/user/login", tryCatch(controller.userLogin));
userRoutes.post("/google-login", tryCatch(controller.googleLogin));
userRoutes.post("/password-reset",tryCatch(controller.forgotPassword))
userRoutes.post("/reset/:token",tryCatch(controller.passwordSave))

module.exports = userRoutes;
