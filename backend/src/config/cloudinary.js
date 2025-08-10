const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for events
const eventImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aidlink/events', // Organize images in folders
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { 
        width: 1200, 
        height: 800, 
        crop: 'limit', 
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    ],
    public_id: (req, file) => {
      // Generate unique public ID
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `event_${timestamp}_${originalName}`;
    },
  },
});

// Storage configuration for cover images (different dimensions)
const coverImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aidlink/events/covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { 
        width: 1920, 
        height: 1080, 
        crop: 'fill', 
        gravity: 'center',
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `cover_${timestamp}_${originalName}`;
    },
  },
});

// Multer configuration for event images
const uploadEventImages = multer({
  storage: eventImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Multer configuration for cover images
const uploadCoverImage = multer({
  storage: coverImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Helper function to delete image from Cloudinary
const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get optimized URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto:good',
    fetch_format: 'auto',
    ...options
  };
  
  return cloudinary.url(publicId, defaultOptions);
};

// Helper function to format image response
const formatImageResponse = (file) => {
  return {
    url: file.path,
    publicId: file.filename,
    originalName: file.originalname,
    uploadedAt: new Date()
  };
};

module.exports = {
  cloudinary,
  uploadEventImages,
  uploadCoverImage,
  deleteImageFromCloudinary,
  getOptimizedImageUrl,
  formatImageResponse
};
