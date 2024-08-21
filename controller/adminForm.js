const bcrypt = require("bcryptjs");
const { constants } = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Song = require("../model/SongSchema");
const Admin = require('../model/AdminSchema')


//admin login
const adminLogin = async (req, res) => {
 
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const admin = await Admin.findOne({email})
  if(!admin){
   return res.status(404).json({
      success:false,
      message:"Email is incorrect"
    })
  }
  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    return res.status(403).send("Incorrect password");
  }


  const adminToken = jwt.sign(
    {
      email: email,
    },
    process.env.JWT_ADMIN
  );
  res.cookie("adminToken", adminToken);

  res.status(201).json({
    message: "Login compleated",
    success: true,
    adminToken,
  });
};

// view all users

const viewUsers = async (req, res) => {
  const user = await User.find();
  if (!user) {
    return res.status(404).json({
      message: "Users is Empty",
    });
  }
  res.status(200).json({
    success: true,
    user,
  });
};
// //view songs
// const viewSong = async (req, res) => {
//   const songs = await Song.find();
//   if (songs.length === 0) {
//     return res.status(404).json({
//       success: false,
//       message: "Songs is Empty",
//     });
//   }
//   res.status(200).json({
//     success: true,
//     songs,
//   });
// };

// //view song by id

module.exports = { adminLogin, viewUsers };
