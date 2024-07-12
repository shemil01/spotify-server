const cloudinary = require('cloudinary').v2
const multer = require('multer')
require('dotenv').config({path:'../config/.env'})
const path = require('path');
const fs = require('fs');

//configure cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// Multer storage configeration
 const storage = multer.diskStorage({})

// Multer upload configeration

const upload = multer({storage:storage}) 

// Middleware to upload image to Cloudinary or use provided URL

const uploadImage = (req,res,next)=>{
    upload.single("image")(req,res,async(error) => {
        try{
            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path)
                req.cloudinaryImageUrl = result.secure_url;

                //Delete the local file after the uploading
                fs.unlinkSync(req.file.path); 
            }else if(req.body.imageUrl){
                req.cloudinaryImageUrl = req.body.imageUrl;
            }
            next()
            }catch (error){
                console.error(error)
                next(error)
            }
    })
}

module.exports = {cloudinary,uploadImage}