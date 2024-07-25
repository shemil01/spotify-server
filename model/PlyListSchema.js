const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  artist: {
    type: String,
    // required: true
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Artist',
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
  coverImage: String,
  genre: String,
  releaseDate: Date,
});

module.exports = mongoose.model("Playlist", playlistSchema);
