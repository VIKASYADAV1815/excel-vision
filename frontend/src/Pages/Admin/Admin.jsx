import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminStats from '../../components/Admin/AdminStats';
import UserManagement from '../../components/Admin/UserManagement';
import './Admin.css';

function Admin() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !user.id) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    setCurrentUser(user);
  }, [navigate]);

  if (!currentUser) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-title">
          <h2>Admin Dashboard</h2>
          <p>Manage users and monitor platform activity</p>
        </div>
        <div className="admin-user-info">
          <img 
            src={currentUser.profilePic || 'https://postimage.me/images/2025/09/04/WhatsApp-Image-2025-08-18-at-13.09.11_3865c9d6.jpg'} 
            alt="Admin" 
            className="admin-avatar"
          />
          <div>
            <div className="admin-name">{currentUser.name || currentUser.username}</div>
            <div className="admin-role">Administrator</div>
          </div>
        </div>
      </div>
      
      <AdminStats />
      <UserManagement />
    </div>
  );
}

export default Admin;
