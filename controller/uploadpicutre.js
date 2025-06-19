const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.UpdatePicture = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'my_folder',
    });

    // Remove local file
    fs.unlinkSync(file.path);

    return res.json({
      message: 'Upload successful',
      url: result.secure_url,
    });
  } catch (err) {
    console.error('Upload failed:', err);
    return res.status(500).json({ message: 'Upload failed' });
  }
};
