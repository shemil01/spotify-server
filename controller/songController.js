const songSchema = require("../model/SongSchema");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");

//add song
const addSong = async (req, res) => {
  const { name, coverImage, fileUrl, artist, duration, description } = req.body;
  console.log(req.body);
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
  if (songData)
    return res.status(200).json({
      success: true,
      songData,
    });
};

//Delete song
const deleteSong = async (req,res) =>{
  const {songId} = req.params
  const song = await songSchema.findByIdAndDelete({
    _id:songId
  })
  res.status(200).json({
    success:true,
    message:"Song deleted"
  })
}


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

module.exports = { addSong, getSongs, getSongById, searchSong,deleteSong };
