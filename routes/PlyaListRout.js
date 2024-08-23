const express = require('express')
const playlistroute = express.Router()
const {tryCatch} = require('../utils/tryCatch')
const {uploadFiles} = require('../middleware/cloudinary')
const controller = require('../controller/PlayList')
const userAuth = require('../middleware/userAuth')

playlistroute.post('/create-playlist/:songId',userAuth,uploadFiles,tryCatch(controller.addPlayList))
playlistroute.post('/addTo-playlist',userAuth,tryCatch(controller.addTOExistPlaylist))
playlistroute.get('/view-playlist',userAuth,tryCatch(controller.viewPlaylist))
playlistroute.get('/playlist-by-id/:playlistId',tryCatch(controller.getPlaylistById))
playlistroute.delete('/remove-song/:songId',userAuth,tryCatch(controller.removeSong))
playlistroute.delete('/delete-playlist/:playlistId',userAuth,tryCatch(controller.deletePlaylist))

module.exports = playlistroute 