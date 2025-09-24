const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables...');

const envPath = path.join(__dirname, '.env');
const envTemplate = `# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/excel-chart-app

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration (Optional - for profile picture uploads)
# Option 1: Use separate variables
# CLOUDINARY_NAME=your-cloudinary-name
# CLOUDINARY_API_KEY=your-cloudinary-api-key
# CLOUDINARY_SECRET=your-cloudinary-secret

# Option 2: Use URL format (recommended)
# CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

# Server Configuration
PORT=5000
NODE_ENV=development
`;

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
  console.log('📝 You can manually edit the .env file if needed.');
} else {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please edit the .env file with your actual values.');
}

console.log('\n📋 Next steps:');
console.log('1. Edit the .env file with your MongoDB URI');
console.log('2. Set a strong JWT_SECRET (change the default!)');
console.log('3. Optionally add Cloudinary credentials for profile picture uploads');
console.log('   - Use CLOUDINARY_URL format: cloudinary://<api_key>:<api_secret>@<cloud_name>');
console.log('   - Or use separate variables: CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET');
console.log('4. Run: npm install');
console.log('5. Run: node test-connection.js');
console.log('6. Run: npm start');
