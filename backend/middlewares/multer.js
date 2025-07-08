// import multer from "multer";

// const storage = multer.diskStorage({
//     filename: function (req, file, callback) {
//         callback(null, file.originalname)
//     }
// });

// const upload = multer({ storage: storage })

// export default upload

import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

// Cloudinary config (from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

// Define Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tutorly_chat_images',   // Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
})

// Export multer middleware with Cloudinary storage
const upload = multer({ storage })

export default upload
