const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Directory to save the uploaded files temporarily
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Generate a unique filename
    }
});

// Ensure the uploads directory exists
if (!fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/');
}

// Multer upload configuration
const upload = multer({ storage: storage });

// Middleware to upload image to Cloudinary or use provided URL
const uploadFiles = (req, res, next) => {
    upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'fileUrl', maxCount: 1 }])(req, res, async (error) => {
        if (error) {
            console.error('Multer Error:', error);
            return next(error);       
        }

        try {
            if (req.files.coverImage) {
                // console.log('Uploading image to Cloudinary...');
                // console.log('Image file path:', req.files.coverImage[0].path);
                const imageResult = await cloudinary.uploader.upload(req.files.coverImage[0].path);
                req.cloudinaryImageUrl = imageResult.secure_url;

                // Delete the local file after uploading
                fs.unlink(req.files.coverImage[0].path, (err) => {
                    if (err) console.error('Error deleting local image file:', err);
                });
            } else if (req.body.imageUrl) {
                req.cloudinaryImageUrl = req.body.imageUrl;
            }

            if (req.files.fileUrl) {
                // console.log('Uploading audio file to Cloudinary...');
                // console.log('Audio file path:', req.files.fileUrl[0].path);
                const audioResult = await cloudinary.uploader.upload(req.files.fileUrl[0].path, {
                    resource_type: 'video' 
                });
                req.cloudinaryAudioUrl = audioResult.secure_url;

                // Delete the local file after uploading
                fs.unlink(req.files.fileUrl[0].path, (err) => {
                    if (err) console.error('Error deleting local audio file:', err);
                });
            } else if (req.body.audioUrl) {
                req.cloudinaryAudioUrl = req.body.audioUrl;
            }

            next();
        } catch (error) {
            console.error('Error during Cloudinary upload:', error);
            next(error);
        }
    });
};

module.exports = { uploadFiles };
