# Setup Guide for Excel Chart Application

## Backend Setup

### 1. Environment Variables
Run the setup script to create the .env file:
```bash
cd backend
node setup-env.js
```

Or manually create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/excel-chart-app

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration (Optional - for profile picture uploads)
# Sign up at https://cloudinary.com/ to get these credentials
# CLOUDINARY_NAME=your-cloudinary-name
# CLOUDINARY_API_KEY=your-cloudinary-api-key
# CLOUDINARY_SECRET=your-cloudinary-secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Test Backend Connection
```bash
node test-connection.js
```

### 4. Start Backend Server
```bash
npm start
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Frontend Development Server
```bash
npm run dev
```

## Fixed Issues

### 1. ChartViewer Error
- Fixed `uploadedFiles is not defined` error by providing fallback data
- Added proper error handling for missing data

### 2. Profile Picture Upload
- Fixed field name mismatch (`profilePic` → `photo`)
- Updated response handling to use correct data structure
- Added proper error handling and progress indicators
- **NEW**: Added fallback to local storage when Cloudinary is not configured
- **NEW**: Better error handling and debugging information

### 3. Profile Editing
- Added missing `name` field to User model
- Updated backend profile route to handle all profile fields
- Fixed form data structure and response handling
- Added profile picture upload section to EditProfile form

### 4. Authentication Issues
- Fixed API endpoint mismatch (`/Auth` → `/auth`)
- Updated Login and Register components to use proper API functions
- Added AuthGuard component to protect routes
- Fixed authentication flow and token handling

### 5. Environment Configuration
- Fixed import paths in index.js
- Added proper ToastContainer configuration
- Updated API base URL handling
- **NEW**: Added automatic environment setup script

## Profile Picture Upload

The application now supports two modes for profile picture uploads:

### Option 1: Local Storage (Default)
- Images are stored locally in the `uploads/profile-pictures/` directory
- No external service required
- Works immediately without additional setup

### Option 2: Cloudinary (Optional)
- Sign up at [Cloudinary](https://cloudinary.com/)
- Get your credentials from the dashboard
- Add them to the `.env` file
- Images will be uploaded to Cloudinary for better performance

## Authentication Flow

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login` with your credentials
3. **Protected Routes**: All main routes now require authentication
4. **Token Management**: JWT tokens are automatically handled

## MongoDB Setup

Make sure MongoDB is running on your system. If you don't have MongoDB installed:

1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. The application will automatically create the database when it first connects

## Troubleshooting

### Common Issues:

1. **500 Internal Server Error on Profile Picture Upload**:
   - Check if MongoDB is running
   - Ensure JWT_SECRET is set in .env file
   - Check if uploads directory has write permissions
   - Try the health check: `GET /api/health`

2. **401 Unauthorized Errors**: 
   - Make sure you're logged in
   - Check if token exists in localStorage
   - Try logging out and logging back in

3. **MongoDB Connection Error**: 
   - Make sure MongoDB is running
   - Check MONGO_URI in .env file
   - Run `node test-connection.js` to test connection

4. **JWT Secret Error**: 
   - Make sure JWT_SECRET is set in .env file
   - Restart the backend server after changing .env

5. **CORS Error**: 
   - Backend is configured to accept requests from localhost:5173 and localhost:3000
   - Check if frontend is running on the correct port

### Error Logs:
- Check browser console for frontend errors
- Check terminal where backend is running for server errors
- Check MongoDB logs for database errors

### Quick Fixes:
- Clear localStorage and login again
- Restart both frontend and backend servers
- Check if all environment variables are set correctly
- Run `node setup-env.js` to recreate .env file

### Health Check:
Test if the backend is running properly:
```bash
curl http://localhost:5000/api/health
```
This should return the server status and Cloudinary configuration status.
