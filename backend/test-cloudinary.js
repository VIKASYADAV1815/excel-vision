// require('dotenv').config();

// console.log('🔧 Testing Cloudinary configuration...');

// // Parse Cloudinary URL if provided
// const parseCloudinaryUrl = (url) => {
//   if (!url) return null;
  
//   try {
//     // Parse cloudinary://<api_key>:<api_secret>@<cloud_name>
//     const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
//     if (match) {
//       return {
//         api_key: match[1],
//         api_secret: match[2],
//         cloud_name: match[3]
//       };
//     }
//   } catch (error) {
//     console.error('Error parsing Cloudinary URL:', error);
//   }
//   return null;
// };

// const cloudinaryUrl = process.env.CLOUDINARY_URL;
// console.log('CLOUDINARY_URL:', cloudinaryUrl ? 'Set' : 'Not set');

// if (cloudinaryUrl) {
//   console.log('Parsing URL:', cloudinaryUrl);
//   const credentials = parseCloudinaryUrl(cloudinaryUrl);
  
//   if (credentials) {
//     console.log('✅ URL parsed successfully:');
//     console.log('  Cloud Name:', credentials.cloud_name);
//     console.log('  API Key:', credentials.api_key.substring(0, 8) + '...');
//     console.log('  API Secret:', credentials.api_secret.substring(0, 8) + '...');
//   } else {
//     console.log('❌ Failed to parse Cloudinary URL');
//     console.log('Expected format: cloudinary://<api_key>:<api_secret>@<cloud_name>');
//     console.log('Example: cloudinary://123456789012345:abcdefghijklmnop@your-cloud-name');
//   }
// } else {
//   console.log('⚠️ CLOUDINARY_URL not set');
//   console.log('Using separate variables:');
//   console.log('  CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME ? 'Set' : 'Not set');
//   console.log('  CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
//   console.log('  CLOUDINARY_SECRET:', process.env.CLOUDINARY_SECRET ? 'Set' : 'Not set');
// }

// console.log('\n📋 To fix the issue:');
// console.log('1. Get your Cloudinary credentials from https://cloudinary.com/console');
// console.log('2. Update your .env file with the correct format:');
// console.log('   CLOUDINARY_URL=cloudinary://<your_actual_api_key>:<your_actual_api_secret>@dyr7bhr7s');
// console.log('3. Replace <your_actual_api_key> and <your_actual_api_secret> with your real values');
