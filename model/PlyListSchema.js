const mongoose = require('mongoose')

const plylistSchema = new mongoose.model(
    {
        title: {
            type: String,
            required: true
          },
          artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artist',
            required: true
          },
          songs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
          }],
          coverImage:String,
          genre:String,
          releaseDate:Date,
    }
)

module.exports = mongoose.model("Playlist", plylistSchema);