const cloudinary = require('cloudinary').v2;
require('dotenv').config()


// 1. Configure Cloudinary


cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.apiKey,
    api_secret: process.env.cloudSecretKey,
})

// 2. Upload a local file
const filePath = 'C:/Users/Lab-2 Instructor PC/Pictures/1.png'; // replace with your file path

cloudinary.uploader.upload(filePath, { folder: 'my_folder' })
  .then(result => {
    console.log('Upload successful!');
    console.log('URL:', result.secure_url);
  })
  .catch(err => {
    console.error('Upload failed:', err);
  });
