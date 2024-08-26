const express = require("express");
const songRouter = express.Router();
const controller = require("../controller/songController");
const { tryCatch } = require("../utils/tryCatch");
const { uploadFiles } = require("../middleware/cloudinary");
const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");
const { roleCheck } = require("../middleware/roleCheck");

songRouter.post(
  "/add-song",
  adminAuth,
  uploadFiles,
  tryCatch(controller.addSong)
);
// songRouter.post('/add-song',roleCheck(['artist', 'admin']),uploadFiles,tryCatch(controller.addSong))
songRouter.get("/view-songs", userAuth, tryCatch(controller.getSongs));
songRouter.get("/admin/songs", adminAuth, tryCatch(controller.getSongs));
songRouter.get("/song-by-id/:songId",userAuth,tryCatch(controller.getSongById));
songRouter.get("/admin/songby-id/:songId",adminAuth,tryCatch(controller.getSongById));
songRouter.delete('/admin/delete-song/:songId',adminAuth,tryCatch(controller.deleteSong))
songRouter.put('/admin/edit-song/:songId',uploadFiles,adminAuth,tryCatch(controller.editSong))
songRouter.get("/search-song", userAuth, tryCatch(controller.searchSong));
module.exports = songRouter;
