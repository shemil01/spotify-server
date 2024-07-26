const express = require('express')
const playlistroute = express.Router()
const {tryCatch} = require('../utils/tryCatch')
const {uploadFiles} = require('../middleware/cloudinary')
const controller = require('../controller/PlayList')

playlistroute.post('/create-playlist/:songId',uploadFiles,tryCatch(controller.addPlayList))
playlistroute.post('/addTo-playlist',tryCatch(controller.addTOExistPlaylist))
playlistroute.get('/view-playlist',tryCatch(controller.viewPlaylist))
playlistroute.get('/playlist-by-id/:playlistId',tryCatch(controller.getPlaylistById))
playlistroute.delete('/remove-song/:songId',tryCatch(controller.removeSong))
playlistroute.delete('/delete-playlist/:playlistId',tryCatch(controller.deletePlaylist))

module.exports = playlistroute 