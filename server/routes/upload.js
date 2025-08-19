const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// @route   POST /api/upload/image
// @desc    Upload image
// @access  Private
router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Check file size
    const maxSize = parseInt(process.env.MAX_IMAGE_SIZE) || 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        error: `Image size must be less than ${maxSize / (1024 * 1024)}MB` 
      });
    }

    // Process image with Sharp
    let processedImage = req.file.buffer;
    
    // Resize if too large
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();
    
    if (metadata.width > 1920 || metadata.height > 1080) {
      processedImage = await image
        .resize(1920, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'freedom-social/images',
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(processedImage);
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      size: result.bytes,
      format: result.format
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Error uploading image' 
    });
  }
});

// @route   POST /api/upload/video
// @desc    Upload video
// @access  Private
router.post('/video', auth, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Check file size
    const maxSize = parseInt(process.env.MAX_VIDEO_SIZE) || 100 * 1024 * 1024; // 100MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        error: `Video size must be less than ${maxSize / (1024 * 1024)}MB` 
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'freedom-social/videos',
          resource_type: 'video',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      size: result.bytes,
      duration: result.duration,
      format: result.format,
      thumbnail: result.thumbnail_url
    });

  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ 
      error: 'Error uploading video' 
    });
  }
});

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No avatar file provided' });
    }

    // Check file size
    const maxSize = 5 * 1024 * 1024; // 5MB for avatars
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        error: 'Avatar size must be less than 5MB' 
      });
    }

    // Process avatar with Sharp
    const processedAvatar = await sharp(req.file.buffer)
      .resize(400, 400, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'freedom-social/avatars',
          resource_type: 'image',
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto:good' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(processedAvatar);
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ 
      error: 'Error uploading avatar' 
    });
  }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete uploaded file
// @access  Private
router.delete('/:publicId', auth, async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({ 
        success: true, 
        message: 'File deleted successfully' 
      });
    } else {
      res.status(400).json({ 
        error: 'Error deleting file' 
      });
    }

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      error: 'Error deleting file' 
    });
  }
});

module.exports = router; 