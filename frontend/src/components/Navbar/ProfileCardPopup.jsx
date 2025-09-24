import React from 'react';
import './Navbar.css';

const DEFAULT_AVATAR = 'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png';

export default function ProfileCardPopup({ user }) {
  if (!user) return null;
  return (
    <div className="profile-card-popup">
      <img
        src={user.profilePic || DEFAULT_AVATAR}
        alt="Profile"
        className="profile-card-avatar"
      />
      <div className="profile-card-info">
        <div className="profile-card-name">{user.name || user.username || 'User'}</div>
        <div className="profile-card-email">{user.email}</div>
      </div>
    </div>
  );
} 