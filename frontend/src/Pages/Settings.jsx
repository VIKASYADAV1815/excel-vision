import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings/Settings.css';
import { getSettings, updatePassword, updateProfileSettings } from '../api';
import { getCurrentUser, setCurrentUser } from './Profile/userUtils';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: user?.preferences?.emailNotifications || false,
    appNotifications: user?.preferences?.appNotifications || false
  });
  const [theme, setTheme] = useState(user?.preferences?.theme || 'dark');
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await getSettings(token);
        if (response.data) {
          setUser(response.data);
          setCurrentUser(response.data);
          setNotificationPrefs({
            emailNotifications: response.data.preferences?.emailNotifications || false,
            appNotifications: response.data.preferences?.appNotifications || false
          });
          setTheme(response.data.preferences?.theme || 'dark');
        }
      } catch (err) {
        setError('Failed to load settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [navigate]);
  
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, token);
      
      setSuccess('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleNotificationChange = async (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs({
      ...notificationPrefs,
      [name]: checked
    });
    
    try {
      const token = localStorage.getItem('token');
      await updateProfileSettings({
        preferences: {
          ...user.preferences,
          [name]: checked
        }
      }, token);
    } catch (err) {
      console.error('Failed to update notification preferences:', err);
    }
  };
  
  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    
    try {
      const token = localStorage.getItem('token');
      await updateProfileSettings({
        preferences: {
          ...user.preferences,
          theme: newTheme
        }
      }, token);
    } catch (err) {
      console.error('Failed to update theme:', err);
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      {loading && <div className="settings-loading">Loading settings...</div>}
      {error && <div className="settings-error">{error}</div>}
      {success && <div className="settings-success">{success}</div>}
      
      {/* Profile Management */}
      <section className="settings-section">
        <h3>Profile Management</h3>
        <div className="settings-profile-info">
          <img 
            src={user?.profilePic || 'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png'} 
            alt="Profile" 
            className="settings-avatar" 
          />
          <div>
            <p className="settings-username">{user?.username}</p>
            <p className="settings-email">{user?.email}</p>
          </div>
        </div>
        <div className="settings-buttons">
          <button className="settings-btn" onClick={() => navigate('/profile')}>View Profile</button>
          <button className="settings-btn" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        </div>
      </section>
      
      {/* Password Change */}
      <section className="settings-section">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input 
              type="password" 
              id="currentPassword"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input 
              type="password" 
              id="newPassword"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="settings-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>
      
      {/* Theme Toggle */}
      <section className="settings-section">
        <h3>Theme</h3>
        <div className="theme-options">
          <button 
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => handleThemeChange('dark')}
          >
            Dark Mode
          </button>
          <button 
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => handleThemeChange('light')}
          >
            Light Mode
          </button>
        </div>
      </section>
      
      {/* Notification Preferences */}
      <section className="settings-section">
        <h3>Notification Preferences</h3>
        <div className="notification-options">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              name="emailNotifications"
              checked={notificationPrefs.emailNotifications}
              onChange={handleNotificationChange}
            /> 
            Email Notifications
          </label>
          <label className="toggle-label">
            <input 
              type="checkbox" 
              name="appNotifications"
              checked={notificationPrefs.appNotifications}
              onChange={handleNotificationChange}
            /> 
            In-App Notifications
          </label>
        </div>
      </section>
      {/* Data Management */}
      <section className="settings-section">
        <h3>Data Management</h3>
        <div className="settings-buttons">
          <button className="settings-btn" onClick={() => navigate('/history')}>View Upload History</button>
          <button className="settings-btn secondary-btn" disabled>Download All Data</button>
        </div>
      </section>
      
      {/* Account Actions */}
      <section className="settings-section">
        <h3>Account Actions</h3>
        <div className="settings-buttons">
          <button className="settings-btn secondary-btn" disabled>Delete Account</button>
          <button 
            className="settings-btn danger-btn" 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </section>
      
      {/* Coming Soon Features */}
      <section className="settings-section">
        <h3>Coming Soon</h3>
        <div className="coming-soon-features">
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h4>Advanced Security</h4>
            <p>Two-factor authentication and login history</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔄</span>
            <h4>Integrations</h4>
            <p>Connect with Google Drive, Dropbox and more</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h4>Custom Dashboard</h4>
            <p>Personalize your analytics dashboard</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;