const mongoose = require('mongoose');


const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  duration: {
    type: Number,
    required: true 
  },
  genre: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  plays: {
    type: Number,
    default: 0 
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true 
});


const Song = mongoose.model('Song', songSchema);

module.exports = Song;
