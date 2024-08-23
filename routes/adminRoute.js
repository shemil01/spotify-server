const express = require('express')
const adminRout = express.Router()
const controller = require('../controller/adminForm')
const adminAuth = require('../middleware/adminAuth')
const {tryCatch} = require('../utils/tryCatch')


adminRout.post('/admin-login',tryCatch(controller.adminLogin))
adminRout.get('/get-all-users',adminAuth,tryCatch(controller.viewUsers))

module.exports = adminRout