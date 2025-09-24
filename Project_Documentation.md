# Excel Data Analysis Project Documentation

## Project Overview

This project is a full-stack web application for Excel data analysis. It allows users to upload Excel files, analyze data, visualize charts, and manage user accounts. The application has both user and admin roles with different permissions and features.

## Project Structure

```
project1/
├── frontend/           # React frontend application
│   ├── public/         # Public assets
│   ├── src/            # Source code
│   │   ├── api.js      # API client for backend communication
│   │   ├── assets/     # Static assets (images, etc.)
│   │   ├── components/ # Reusable React components
│   │   ├── Pages/      # Page components
│   │   └── App.jsx     # Main application component
│   ├── .env            # Environment variables
│   └── package.json    # Dependencies and scripts
├── backend/            # Node.js backend application
│   ├── models/         # MongoDB data models
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded files storage
│   ├── .env            # Environment variables
│   ├── cloudinary.js   # Cloudinary integration
│   ├── server.js       # Main server file
│   └── package.json    # Dependencies and scripts
└── Project_Documentation.md  # This documentation file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (optional, for image uploads)

### Step 1: Clone the Repository

```bash
# Create project directory
mkdir project1
cd project1
```

### Step 2: Backend Setup

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize package.json
npm init -y

# Install dependencies
npm install express mongoose dotenv bcryptjs jsonwebtoken multer cors cloudinary xlsx

# Create .env file
```

Create a `.env` file in the backend directory with the following content:

```
MONGO_URI=mongodb://localhost:27017/excel_analysis
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_secret
CLOUDINARY_NAME=your_cloudinary_name
```

### Step 3: Frontend Setup

```bash
# Navigate back to project root
cd ..

# Create frontend using Vite
npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install
npm install axios react-router-dom react-toastify chart.js react-chartjs-2 @mui/material @emotion/react @emotion/styled

# Create .env file
```

Create a `.env` file in the frontend directory with the following content:

```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run dev
```

## Admin Setup

To create an admin user, run the setup-admin.js script:

```bash
cd backend
node setup-admin.js
```

This will create an admin user with the following credentials:
- Email: vikas@gmail.com
- Password: vikas1518
- Username: vikasadmin

## Features

### User Features

1. **Authentication**
   - Register new account
   - Login with email and password
   - Profile management

2. **Excel Data Analysis**
   - Upload Excel files
   - View data in tabular format
   - Generate charts and visualizations

3. **Profile Management**
   - Update profile information
   - Change profile picture
   - Update password

4. **Settings**
   - Theme preferences (light/dark)
   - Notification settings

### Admin Features

1. **User Management**
   - View all users
   - Block/unblock users
   - Delete users
   - Change user roles

2. **Statistics**
   - View platform usage statistics
   - Monitor user activity
   - Track file uploads

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Profile

- `POST /api/profile/photo` - Upload profile photo
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update user profile

### Settings

- `GET /api/settings` - Get user settings
- `PUT /api/settings/password` - Update password
- `PUT /api/settings/profile` - Update profile settings
- `PUT /api/settings/preferences` - Update user preferences

### Uploads

- `POST /api/uploads` - Upload Excel file
- `GET /api/uploads` - Get all uploads
- `GET /api/uploads/:id` - Get specific upload

### Analysis

- `GET /api/analysis/:fileId` - Get analysis for a file
- `POST /api/analysis/:fileId` - Create analysis for a file

### Admin

- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics
- `PUT /api/admin/users/:userId/block` - Block/unblock user
- `DELETE /api/admin/users/:userId` - Delete user
- `PUT /api/admin/users/:userId/role` - Update user role

## Troubleshooting

### Login Issues

If you encounter a 400 Bad Request error when logging in:

1. Ensure you're using the correct credentials
2. Check that the backend server is running
3. Verify that the MongoDB connection is working
4. Check the browser console for specific error messages

### Image Upload Issues

If image uploads are not working:

1. Check Cloudinary configuration in the backend .env file
2. Ensure the frontend is correctly calling the upload API
3. Check for file size or format restrictions

## Accessing Admin Dashboard

1. Start both backend and frontend servers
2. Navigate to the login page (http://localhost:5173/login or the port shown in your terminal)
3. Enter admin credentials:
   - Email: vikas@gmail.com
   - Password: vikas1518
4. After successful login, you will be automatically redirected to the admin dashboard
5. If not automatically redirected, navigate to /admin route manually

## Technology Stack

### Frontend

- React.js with Vite
- React Router for navigation
- Axios for API requests
- Chart.js for data visualization
- React Toastify for notifications
- Material UI components

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for image storage
- XLSX for Excel file processing

## Security Considerations

- JWT authentication for API security
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Secure file upload handling

## Future Enhancements

- Advanced data analysis features
- Export functionality for charts and reports
- Real-time collaboration features
- Additional chart types and visualizations
- Mobile responsive design improvements