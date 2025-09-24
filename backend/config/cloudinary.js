const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Parse Cloudinary URL if provided
const parseCloudinaryUrl = (url) => {
  if (!url) return null;
  
  try {
    // Parse cloudinary://<api_key>:<api_secret>@<cloud_name>
    const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (match) {
      return {
        api_key: match[1],
        api_secret: match[2],
        cloud_name: match[3]
      };
    }
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
  }
  return null;
};

// Check if Cloudinary is configured
const cloudinaryUrl = process.env.CLOUDINARY_URL;
const cloudinaryCredentials = parseCloudinaryUrl(cloudinaryUrl);

const isCloudinaryConfigured = (process.env.CLOUDINARY_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_SECRET) || 
                              cloudinaryCredentials;

// Configure Cloudinary only if credentials are available
if (isCloudinaryConfigured) {
  try {
    if (cloudinaryCredentials) {
      // Use URL format
      cloudinary.config({
        cloud_name: cloudinaryCredentials.cloud_name,
        api_key: cloudinaryCredentials.api_key,
        api_secret: cloudinaryCredentials.api_secret,
      });
      console.log('✅ Cloudinary configured using URL format');
    } else {
      // Use separate variables
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      });
      console.log('✅ Cloudinary configured using separate variables');
    }
  } catch (error) {
    console.error('❌ Error configuring Cloudinary:', error);
  }
} else {
  console.log('⚠️ Cloudinary not configured - using local storage fallback');
}

// Configure multer for memory storage (we'll upload to Cloudinary manually)
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Function to save image locally (fallback)
const saveImageLocally = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    const profilePicsDir = path.join(uploadsDir, 'profile-pictures');
    
    // Create directories if they don't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    if (!fs.existsSync(profilePicsDir)) {
      fs.mkdirSync(profilePicsDir);
    }
    
    const filePath = path.join(profilePicsDir, filename);
    
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error('Error saving image locally:', err);
        reject(err);
      } else {
        // Return a local URL
        resolve({
          secure_url: `/uploads/profile-pictures/${filename}`,
          public_id: filename
        });
      }
    });
  });
};

// Function to upload image to Cloudinary or save locally
const uploadToCloudinary = async (buffer, options = {}) => {
  if (isCloudinaryConfigured) {
    // Use Cloudinary if configured
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: 'profile-pictures',
        transformation: [{ width: 300, height: 300, crop: 'fill' }],
        resource_type: 'auto',
        ...options
      };
      
      let attempts = 0;
      const maxAttempts = 3;
      
      const attemptUpload = () => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error(`Cloudinary upload error (attempt ${attempts+1}/${maxAttempts}):`, error);
              attempts++;
              if (attempts < maxAttempts) {
                console.log(`Retrying upload in 1 second...`);
                setTimeout(attemptUpload, 1000);
              } else {
                reject(error);
              }
            } else {
              console.log('✅ Image uploaded to Cloudinary successfully');
              resolve(result);
            }
          }
        ).end(buffer);
      };
      
      attemptUpload();
    });
  } else {
    // Fallback to local storage
    console.log('📁 Saving image locally (Cloudinary not configured)');
    const timestamp = Date.now();
    const filename = `profile_${timestamp}.jpg`;
    return saveImageLocally(buffer, filename);
  }
};

module.exports = { cloudinary, upload, uploadToCloudinary, isCloudinaryConfigured };