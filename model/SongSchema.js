const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    artist: {
      type: String,
    },
    playlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },
    fileUrl: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
    coverImage: {
      type: String,
      required: true,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
