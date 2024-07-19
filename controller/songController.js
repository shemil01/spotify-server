const songSchema = require("../model/SongSchema");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");




//add song
const addSong = async (req, res) => {
  const { name, coverImage, fileUrl } = req.body;

  //   if (!name || !coverImage || !fileUrl) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Please fill all fields",
  //     });
  //   }
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
  });
  res.status(201).json({
    success: true,
    message: "Song added successfully",
    newSong
  });
};

// get songs

const getSongs = async(req,res)=>{


    const songs = await songSchema.find()

    if(songs.length === 0){
        return res.status(404).json({
            success:false,
            message:"songs not found"
        })
    }
    else{
        res.status(200).json({
            success:true,
            songs,
        })
    }
}


//view song by id

// const  


module.exports = { addSong };
