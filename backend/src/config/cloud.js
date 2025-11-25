import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Single image storage (for announcements, photos)
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'faith-connect/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    resource_type: 'auto'
  }
});

// Sermon media storage (audio, video, pdf, thumbnails)
const sermonStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folder = 'faith-connect/sermons';
    
    // Determine folder based on field name
    if (file.fieldname === 'audio') {
      folder = 'faith-connect/sermons/audio';
    } else if (file.fieldname === 'video') {
      folder = 'faith-connect/sermons/video';
    } else if (file.fieldname === 'notes') {
      folder = 'faith-connect/sermons/notes';
    } else if (file.fieldname === 'thumbnail') {
      folder = 'faith-connect/sermons/thumbnails';
    }
    
    return {
      folder: folder,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp3', 'mp4', 'wav', 'pdf']
    };
  }
});

// Multer upload instances
export const uploadImage = multer({ 
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export const uploadSermon = multer({ 
  storage: sermonStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for sermons
});

export { cloudinary };