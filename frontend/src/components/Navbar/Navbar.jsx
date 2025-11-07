import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { toast } from 'react-toastify';
import ProfileCardPopup from './ProfileCardPopup';
import styled from 'styled-components';
import { IoIosCloudUpload } from "react-icons/io";
import { MdSpaceDashboard } from "react-icons/md";
import { RiBarChartBoxAiFill } from "react-icons/ri";
import { MdManageHistory } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
const sidebarOptions = [
  { id: 'dashboard', label: 'Dashboard', to: '/', icon: MdSpaceDashboard },
  { id: 'uploads', label: 'Uploads', to: '/uploads', icon: IoIosCloudUpload },
  { id: 'charts', label: 'Charts', to: '/charts', icon: RiBarChartBoxAiFill },
  { id: 'history', label: 'History', to: '/history', icon: MdManageHistory },
  { id: 'settings', label: 'Settings', to: '/settings', icon: CiSettings },
];
const StyledMobileDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 300px;
  z-index: 1000;
  .radio-container {
    --main-color: #f7e479;
    --main-color-opacity: #f7e4791c;
    --total-radio: ${sidebarOptions.length};
    display: flex;
    flex-direction: column;
    position: relative;
    padding-left: 0.5rem;
    background: rgb(13, 13, 13);
    border-radius: 8px;
    margin-top: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
  }

  .radio-container input {
    cursor: pointer;
    appearance: none;
  }

  .radio-container .glider-container {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(27, 27, 27, 1) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    width: 1px;
  }

  .radio-container .glider-container .glider {
    position: relative;
    height: calc(100% / var(--total-radio));
    width: 100%;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0) 0%,
      var(--main-color) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    transition: transform 0.3s ease;
  }

  .radio-container .glider-container .glider::before {
    content: "";
    position: absolute;
    height: 60%;
    width: 300%;
    top: 50%;
    transform: translateY(-50%);
    background: var(--main-color);
    filter: blur(10px);
  }

  .radio-container .glider-container .glider::after {
    content: "";
    position: absolute;
    left: 0;
    height: 100%;
    width: 150px;
    background: linear-gradient(
      90deg,
      var(--main-color-opacity) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .radio-container label {
    cursor: pointer;
    padding: 1rem;
    position: relative;
    width: 100%;
    
    .nav-link {
      color: grey;
      text-decoration: none;
      transition: color 0.2s ease;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;

      .nav-icon {
        font-size: 1.2rem;
      }
    }
  }

  .radio-container input:checked + label .nav-link {
    color: var(--main-color);
  }

  .radio-container input:checked + label .nav-icon {
    color: var(--main-color);
  }

  ${[...Array(10)].map((_, i) => `
    .radio-container input:nth-of-type(${i + 1}):checked ~ .glider-container .glider {
      transform: translateY(${i * 100}%);
    }
  `).join('')}

  .profile-btn, .logout-btn {
    width: 100%;
    padding: 1rem;
    margin-top: 0.5rem;
    background: rgb(13, 13, 13);
    border-radius: 8px;
    color: grey;
    transition: color 0.2s ease;
    text-align: left;
    border: none;
    text-decoration: none;
    display: block;

    &:hover {
      color: var(--main-color);
    }
  }
`;

function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

const Navbar = ({ onHamburgerClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [user, setUser] = useState(getCurrentUser());
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const option = sidebarOptions.find(opt => opt.to === currentPath);
    if (option) {
      setSelectedOption(option.id);
    }
  }, [location.pathname]);

  const handleHamburgerClick = () => {
    if (isMobile) setShowDropdown((v) => !v);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{ position: 'relative', border: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {isMobile && (
          <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#4f8cff' }}>📊</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#b0b3b8' }}>Excel Vision</span>
          </div>
        )}
        <div className="navbar-greeting btn-shine" style={{ flex: 1 }}>Welcome, {user?.name || user?.username || 'User'}!</div>
        {isMobile && (
          <button
            className="hamburger"
            onClick={handleHamburgerClick}
            aria-label="Open sidebar"
            style={{ marginLeft: 'auto' }}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        )}
        {!isMobile && (
          <div className="navbar-actions" style={{ position: 'relative' }}>
            <button
              className="github-btn profile-btn-avatar"
              type="button"
              onClick={() => navigate('/profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}
              onMouseEnter={() => setShowProfilePopup(true)}
              onMouseLeave={() => setTimeout(() => setShowProfilePopup(false), 120)}
            >
              Profile
              <img
                src={user?.profilePic || 'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png'}
                alt="Profile"
                className="navbar-profile-avatar"
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
              />
            </button>
            {showProfilePopup && (
              <div
                onMouseEnter={() => setShowProfilePopup(true)}
                onMouseLeave={() => setShowProfilePopup(false)}
                style={{ position: 'absolute', top: '110%', right: 0, zIndex: 1000 }}
              >
                <ProfileCardPopup user={user} />
              </div>
            )}
            <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      {showDropdown && isMobile && (
        <StyledMobileDropdown>
          <div className="radio-container">
            {sidebarOptions.map((opt) => (
              <React.Fragment key={opt.id}>
                <input
                  type="radio"
                  id={opt.id}
                  name="navigation"
                  checked={selectedOption === opt.id}
                  onChange={() => {
                    setSelectedOption(opt.id);
                    navigate(opt.to);
                    setShowDropdown(false);
                  }}
                />
                <label htmlFor={opt.id}>
                  <span className="nav-link">
                    <opt.icon className="nav-icon" /> {opt.label}
                  </span>
                </label>
              </React.Fragment>
            ))}
            <div className="glider-container">
              <div className="glider" />
            </div>
          </div>
          <Link to="/profile" onClick={() => setShowDropdown(false)} className="profile-btn" style={{ width: '100%', boxSizing: 'border-box' }}>
            👤 Profile
          </Link>
          <button 
            className="nav-btn logout-btn" 
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </StyledMobileDropdown>
      )}
    </nav>
  );
};

export default Navbar;
