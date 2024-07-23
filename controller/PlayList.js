const songSchema = require('../model/SongSchema')
const playListSchema = require('../model/PlyListSchema') 
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const addExistPlayList = async(req,res)=>{
    const {songId} = req.params;
    const {token} = req.cookies
    const valid = await jwt.verify(token, process.env.jwt_secret);
    const userId = valid.id

    const palaylist = await playListSchema.findOne({userId})
    
if(palaylist){
    
}

}