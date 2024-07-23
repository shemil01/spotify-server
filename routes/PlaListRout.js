const express = require('express')
const playlistroute = express.Router()
const {tryCatch} = require('../utils/tryCatch')
const {uploadFiles} = require('../middleware/cloudinary')
const controller = require('../controller/PlayList')

playlistroute.post('/create-playlist/:songId',uploadFiles,tryCatch(controller.addPlayList))
playlistroute.post('/addTo-playlist',tryCatch(controller.addTOExistPlaylist))
playlistroute.get('/view-playlist/:playlistId',tryCatch(controller.viewPlaylist))

module.exports = playlistroute 