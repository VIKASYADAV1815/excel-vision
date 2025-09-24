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
        formData.append('photo', file);
        
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
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div className="profile-edit-glass" style={{
        maxWidth: '500px',
        width: '100%',
        padding: '25px',
        borderRadius: '15px',
        backgroundColor: 'rgba(22, 24, 29, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        color: '#fff'
      }}>
        <div className="edit-profile-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, color: '#fff' }}>Edit Profile</h2>
          <button 
            type="button" 
            onClick={() => navigate('/profile')}
            style={{
              padding: '8px 15px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>
        
        {success && <div style={{
          padding: '10px',
          backgroundColor: 'rgba(47, 129, 90, 0.2)',
          color: '#4ade80',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>{success}</div>}
        {error && <div style={{
          padding: '10px',
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          color: '#ef4444',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>{error}</div>}
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
            <img 
              src={form.profilePic} 
              alt="Profile"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(255, 255, 255, 0.1)'
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              style={{
                padding: '8px 15px',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {isUploading ? 'Uploading...' : 'Change Picture'}
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff'
              }}
            />
            
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
          
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'flex-end',
            marginTop: '10px'
          }}>
            <button 
              type="submit" 
              disabled={loading || isUploading}
              style={{
                padding: '8px 20px',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/profile')}
              style={{
                padding: '8px 20px',
                backgroundColor: 'rgba(220, 38, 38, 0.5)',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
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