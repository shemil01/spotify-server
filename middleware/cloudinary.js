const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path'); // Require path module before using it
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage configuration
const storage = multer.diskStorage({});

// Multer upload configuration
const upload = multer({ storage: storage });

// Middleware to upload image to Cloudinary or use provided URL
const uploadImage = (req, res, next) => {
    upload.single("profilePicture")(req, res, async (error) => {
        if (error) {
            console.error(error);
            return next(error);
        }

        try {
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                req.cloudinaryImageUrl = result.secure_url;

                // Delete the local file after uploading
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error(err);
                });
            } else if (req.body.imageUrl) {
                req.cloudinaryImageUrl = req.body.imageUrl;
            }
            next();
        } catch (error) {
            console.error(error);
            next(error);
        }
    });
}

module.exports = { cloudinary, uploadImage };
