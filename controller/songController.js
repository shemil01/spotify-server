const songSchema = require("../model/SongSchema");
const userSchema = require("../model/User");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

//add song
const addSong = async (req, res) => {
  const { name, coverImage, fileUrl, artist, duration, description } = req.body;

  const isExist = await songSchema.findOne({ name });
  if (isExist) {
    return res.status(400).json({
      success: false,
      message: "Song already exist",
    });
  }

  const newSong = await songSchema.create({
    name,
    coverImage: req.cloudinaryImageUrl || newSong.coverImage,
    fileUrl: req.cloudinaryAudioUrl || newSong.fileUrl,
    artist,
    description,
    duration,
  });
  res.status(201).json({
    success: true,
    message: "Song added successfully",
    newSong,
  });
};

// edit song

const editSong = async (req, res) => {
  const { songId } = req.params;
  const { name, coverImage, fileUrl, artist, duration, description } = req.body;
  console.log(req.body);

  const song = await songSchema.findById(songId);
  if (!song) {
    return res.status(404).json({
      success: false,
      message: "Song not  found",
    });
  }
  await songSchema.findByIdAndUpdate(
    { _id: songId },
    {
      name,
      coverImage: req.cloudinaryImageUrl,
      fileUrl: req.cloudinaryAudioUrl,
      artist,
      duration,
      description,
    }
  );
  res.status(201).json({
    success: true,
    message: "Song updated ",
  });
};

// get songs

const getSongs = async (req, res) => {
  const songs = await songSchema.find();

  if (songs.length === 0) {
    return res.status(404).json({
      success: false,
      message: "songs not found",
    });
  } else {
    res.status(200).json({
      success: true,
      songs,
    });
  }
};

//view song by id

const getSongById = async (req, res) => {
  const { songId } = req.params;

  const songData = await songSchema.findById({ _id: songId });
  if (songData) {
    return res.status(200).json({
      success: true,
      songData,
    });
  }
};

//Delete song
const deleteSong = async (req, res) => {
  const { songId } = req.params;
  const song = await songSchema.findByIdAndDelete({
    _id: songId,
  });
  res.status(200).json({
    success: true,
    message: "Song deleted",
  });
};

//search songs
const searchSong = async (req, res) => {
  const query = req.query.q;

  const suggestions = await songSchema
    .find({
      name: { $regex: query, $options: "i" },
    })
    .limit(5);

  const results = await songSchema.find({
    name: { $regex: query, $options: "i" },
  });

  res.status(200).json({
    success: true,
    song: results,
    suggestions: suggestions,
  });
};

// add to favourite

const likeSong = async (req, res) => {
  const { songId } = req.params;
  const { token } = req.cookies;

  const valid = await jwt.verify(token, process.env.JWT_SECRET);
  const userId = valid.id;
  const checkSong = await userSchema.findById(userId).populate("likedSongs");
  if (checkSong) {
    checkSong.likedSongs.push(songId);
    await checkSong.save();
    res.status(201).json({
      success: true,
      message: "Song added to favourite",
    });
  } else {
    res.status(404).json({
      success: true,
      message: "User not found",
    });
  }
};

module.exports = {
  addSong,
  getSongs,
  getSongById,
  searchSong,
  deleteSong,
  editSong,
  likeSong
};
