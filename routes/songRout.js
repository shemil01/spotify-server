const express = require('express')
const songRouter = express.Router()
const controller = require('../controller/songController')
const {tryCatch} = require('../utils/tryCatch')
const {uploadFiles} = require('../middleware/cloudinary')
const userAuth = require('../middleware/userAuth')


songRouter.post('/add-song',uploadFiles,tryCatch(controller.addSong))
songRouter.get('/view-songs',tryCatch(controller.getSongs))
songRouter.get('/song-by-id/:songId',tryCatch(controller.getSongById))
module.exports = songRouter