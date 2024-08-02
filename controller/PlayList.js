const songSchema = require("../model/SongSchema");
const Playlist = require("../model/PlyListSchema");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userSchema = require("../model/User");

//create playlist
const addPlayList = async (req, res) => {
  const { songId } = req.params;
  const { title, coverImage, description } = req.body;
  if (!title) {
    return res.status(400).send("Enter a Title");
  }
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication token is required" });
  }

  const valid = await jwt.verify(token, process.env.JWT_SECRET);
  const userId = valid.id;
  const user = await userSchema.findById({ _id: userId });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const newPlaylist = await Playlist.create({
    title,
    userId,
    description,
    songs: [songId],
    coverImage: req.cloudinaryImageUrl || coverImage,
  });
  user.playlists.push(newPlaylist._id);
  await user.save();

  res.status(201).json({
    success: true,
    message: "Song added to playlist",
    playlist: newPlaylist,
  });
};

//add to existing play list
const addTOExistPlaylist = async (req, res) => {
  const { songId, playlistId } = req.body;

  let checkPlaylist = await Playlist.findById(playlistId).populate("songs");

  if (checkPlaylist) {
    checkPlaylist.songs.push(songId);
    await checkPlaylist.save();

    res.status(201).json({
      success: true,
      playlist: checkPlaylist,
    });
  } else {
    res.status(404).json({ success: false, message: "Playlist not found" });
  }
};
// view playlists

const viewPlaylist = async (req, res) => {
  const { token } = req.cookies;

  const valid = jwt.verify(token, process.env.JWT_SECRET);

  const userId = valid.id;
  const playlist = await Playlist.find({ userId }).populate("songs");

  if (playlist) {
    res.status(200).json({
      success: true,
      playlist,
    });
  }
};

//view playlist by id

const getPlaylistById = async (req, res) => {
  const { playlistId } = req.params;

  const playlists = await Playlist.findById(playlistId).populate("songs");

  if (playlists) {
    res.status(200).json({
      success: true,
      playlists: playlists,
    });
  } else {
    res.status(404).json({ success: false, message: "Playlist not found" });
  }
};

//song remove from playlist

const removeSong = async (req, res) => {
  const { token } = req.cookies;

  const { songId } = req.params;

  const valid = jwt.verify(token, process.env.JWT_SECRET);
  const userId = valid.id;

  const playlist = await Playlist.findOne({ userId: userId });

  if (!playlist) {
    res.status(404).send("Playlist is empty");
  }

  const songIndex = playlist.songs.findIndex(
    (song) => song.toString() === songId
  );
  if (songIndex !== -1) {
    playlist.songs.splice(songIndex, 1);
    await playlist.save();
    return res.status(200).json({
      message: "Song removed from playlist",
      success: true,
    });
  } else {
    return res.status(404).send("Song not found in your playlist");
  }
};

// delete playlist
const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { token } = req.cookies;

  const valid = jwt.verify(token, process.env.JWT_SECRET);
  const userId = valid.id;
  console.log(userId);
  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    userId: userId,
  });

  if (!playlist) {
    return res.status(404).send("playlist not found");
  }
  await userSchema.findByIdAndUpdate(userId, {
    $pull: { playlists: playlistId },
  });
  res.status(200).json({
    success: true,
    message: "Playlist deleted",
  });
};

module.exports = {
  addPlayList,
  addTOExistPlaylist,
  getPlaylistById,
  viewPlaylist,
  removeSong,
  deletePlaylist,
};
