import React, { useRef, useState } from 'react';
import './Profile.css'; 
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/bg2.jpg';
import { toast } from 'react-toastify';
import { getCurrentUser, setCurrentUser } from './userUtils';
import { uploadProfilePhoto } from '../../api';

const DEFAULT_AVATAR = 'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png';

const Profile = () => {
  const user = getCurrentUser();
  const [avatar, setAvatar] = useState(user?.profilePic || DEFAULT_AVATAR);
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle image selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => setPendingAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Upload profile picture to server
  const handleSave = async () => {
    if (!pendingAvatar) {
      toast.info('No changes to save');
      return;
    }

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      // Convert base64 to file
      const response = await fetch(pendingAvatar);
      const blob = await response.blob();
      const file = new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('photo', file);

      const result = await uploadProfilePhoto(formData, token);
      
      // Update local storage with new user data
      const updatedUser = { ...user, profilePic: result.data.url };
      setCurrentUser(updatedUser);
      setAvatar(result.data.url);
      setPendingAvatar(null);
      
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.msg || 'Failed to upload profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '2rem',
        paddingTop: '8vh',
        paddingRight: '4vw'
      }}
    >
      <div className="profile-page-glass" style={{
        width: '90%',
        maxWidth: '500px',
        padding: '2rem',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
        '@media (max-width: 768px)': {
          width: '95%',
          padding: '1.5rem'
        },
        '@media (max-width: 480px)': {
          width: '100%',
          padding: '1rem'
        }
      }}>
        <div className="avatar-wrapper">
          <img 
            src={pendingAvatar || avatar} 
            alt="Profile" 
            className="profile-avatar-large" 
            style={{
              maxWidth: '150px',
              height: 'auto',
              '@media (max-width: 480px)': {
                maxWidth: '120px'
              }
            }}
          />
          <button
            className="avatar-change-btn"
            onClick={() => fileInputRef.current.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Change'}
          </button>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>
        <div className="profile-info-block">
          <div className="profile-name-large">{user?.name || user?.username || 'User'}</div>
          <div className="profile-email-large">{user?.email}</div>
        </div>
        <div className="profile-actions-block">
          <button className="profile-action-btn" onClick={() => navigate('/edit-profile')}>
            Edit Profile
          </button>
          <button 
            className="profile-action-btn" 
            onClick={handleSave}
            disabled={!pendingAvatar || isUploading}
          >
            {isUploading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
