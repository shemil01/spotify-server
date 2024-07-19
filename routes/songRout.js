const express = require('express')
const songRouter = express.Router()
const controller = require('../controller/songController')
const {tryCatch} = require('../utils/tryCatch')
const {uploadFiles} = require('../middleware/cloudinary')

songRouter.post('/add-song',uploadFiles,tryCatch(controller.addSong))

module.exports = songRouter