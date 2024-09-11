const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    password: {
      type: String,
      required: function () {
        return this.loginMethod !== "Google";
      },
    },
    loginMethod: {
      type: String,
      required: true,
      default: "Local",
    },
    likedSongs: [
      {
        songId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "song",
          required: true,
        },
      },
    ],
    playlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
    subscriptionType: { type: String, default: "Free" },
    profilePicture: String,
    dateOfBirth: {
      type: Date,
      day: required,
      year: required,
      month: required,
      required: function () {
        return this.loginMethod !== "Google";
      },
    },
    role: { type: String, enum: ['user', 'artist', 'admin'], default: 'user' }, 
    gender: {
      type: String,
      enum: ["Male", "Female", "Non-Binary", "Other"],
      required: function () {
        return this.loginMethod !== "Google";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
