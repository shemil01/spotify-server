const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
  },
  fileUrl: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
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
