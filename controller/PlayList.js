const songSchema = require("../model/SongSchema");
const Playlist = require("../model/plylistSchema");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");



//add to playlist 
const addPlayList = async (req, res) => {
  const { songId } = req.params;
  const data= req.body;
  const { token } = req.cookies;

  if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication token is required' });
  }

  const valid = await jwt.verify(token, process.env.JWT_SECRET);
  const userId = valid.id;

  if (!data.title || !coverImage || !data.artist) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const newPlaylist = await Playlist.create({
    title,
    artist,
    songs: [songId],
    coverImage: req.cloudinaryImageUrl || coverImage,
  });

  res.status(201).json({
    success: true,
    message: "Song added to playlist",
    playlist: newPlaylist,
  });
};


//add to existing play list
const addTOExistPlaylist = async(req,res) => {
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

}

//view playlist

const viewPlaylist = async(req,res) => {
    const {playlistId} = req.params

    const playlists = await Playlist.findById(playlistId).populate("songs")

    if(playlists) {
        res.status(200).json({
            success:true,
            playlists:playlists
        })
    }else{
        res.status(404).json({ success: false, message: "Playlist not found" });
    }
}

module.exports = { addPlayList,addTOExistPlaylist,viewPlaylist };
