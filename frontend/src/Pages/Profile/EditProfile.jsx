import React, { useState, useRef } from 'react';
import './Profile.css';
import bg2 from '../../assets/bg1.jpg';
import { getCurrentUser, setCurrentUser } from './userUtils';
import { useNavigate } from 'react-router-dom';
import { uploadProfilePhoto, updateProfileInfo } from '../../api';

const DEFAULT_AVATAR = 'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png';

const EditProfile = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    profilePic: user?.profilePic || DEFAULT_AVATAR,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clear any previous messages
      setSuccess('');
      setError('');
      
      try {
        setIsUploading(true);
        setUploadProgress(10);
        
        const formData = new FormData();
        // Backend expects 'profilePic' field name
        formData.append('profilePic', file);
        
        const token = localStorage.getItem('token');
        setUploadProgress(30);
        
        const response = await uploadProfilePhoto(formData, token);
        setUploadProgress(100);
        
        if (response.data && response.data.url) {
          // Only update form and local storage after successful API response
          setForm(prev => ({ ...prev, profilePic: response.data.url }));
          setCurrentUser({ ...user, profilePic: response.data.url });
          setSuccess('Profile picture updated successfully!');
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccess('');
          }, 3000);
        } else {
          throw new Error('No URL returned from server');
        }
      } catch (err) {
        console.error('Profile picture upload error:', err);
        setError(err.response?.data?.message || err.response?.data?.msg || 'Failed to upload profile picture. Please try again.');
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          setError('');
        }, 5000);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const profileData = {
        name: form.name,
        username: form.username,
        email: form.email,
        bio: form.bio,
        phone: form.phone
      };
      
      const response = await updateProfileInfo(profileData, token);
      
      if (response.data) {
        setCurrentUser({
          ...response.data,
          profilePic: form.profilePic
        });
      }
      
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        setSuccess('');
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container" style={{
      backgroundImage: `url(${bg2})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="profile-edit-glass">
        <div className="edit-profile-header">
          <h2>Edit Profile</h2>
          <button 
            type="button" 
            className="back-btn"
            onClick={() => navigate('/profile')}
          >
            ← Back
          </button>
        </div>
        
        {success && <div className="profile-success-msg">{success}</div>}
        {error && <div className="profile-error-msg">{error}</div>}
        
        <form onSubmit={handleSave} className="profile-edit-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Avatar block removed per request - only input fields remain */}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Full name field removed to simplify per request */}
            
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff'
              }}
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff'
              }}
            />
            
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff'
              }}
            />
            
            <textarea
              name="bio"
              placeholder="About Me"
              value={form.bio}
              onChange={handleChange}
              rows={2}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div className="form-actions sticky">
            <button 
              type="submit" 
              disabled={loading || isUploading}
              className="profile-save-btn"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;