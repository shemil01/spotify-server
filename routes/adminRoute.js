const express = require('express')
const adminRout = express.Router()
const controller = require('../controller/adminForm')
const {tryCatch} = require('../utils/tryCatch')


adminRout.post('/admin-login',tryCatch(controller.adminLogin))

module.exports = adminRout