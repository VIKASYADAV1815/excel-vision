import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import logo from "../../assets/logo.png";
import { IoIosCloudUpload } from "react-icons/io";
import { MdSpaceDashboard } from "react-icons/md";
import { RiBarChartBoxAiFill } from "react-icons/ri";
import { MdManageHistory } from "react-icons/md";
import { CiSettings } from "react-icons/ci";

const baseOptions = [
  { id: "dashboard", label: "Dashboard", to: "/", icon: MdSpaceDashboard },
  { id: "uploads", label: "Uploads", to: "/uploads", icon: IoIosCloudUpload },
  { id: "charts", label: "Charts", to: "/charts", icon: RiBarChartBoxAiFill },
  { id: "history", label: "History", to: "/history", icon: MdManageHistory },
  { id: "settings", label: "Settings", to: "/settings", icon: CiSettings },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [options, setOptions] = useState(baseOptions);
  const [selectedOption, setSelectedOption] = useState(() => {
    const currentPath = location.pathname;
    const option = baseOptions.find(opt => opt.to === currentPath) || baseOptions[0];
    return option.id;
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'admin') {
      setOptions([...baseOptions, { id: "admin", label: "Admin", to: "/admin" }]);
    } else {
      setOptions(baseOptions);
    }
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const option = options.find(opt => opt.to === currentPath);
    if (option) {
      setSelectedOption(option.id);
    }
  }, [location.pathname, options]);

  const handleNavigation = (opt) => {
    setSelectedOption(opt.id);
    navigate(opt.to);
  };

  return (
    <StyledSidebar>
      <div className="sidebar-logo">
        <img src={logo} alt="Excel vision Logo" className="logo-img" />
      </div>
      <div className="radio-container">
        {options.map((opt, index) => (
          <React.Fragment key={opt.id}>
            <input
              type="radio"
              id={opt.id}
              name="navigation"
              checked={selectedOption === opt.id}
              onChange={() => handleNavigation(opt)}
            />
            <label htmlFor={opt.id}>
              <span className="nav-link">
                {opt.icon && <opt.icon className="nav-icon" />} {opt.label}
              </span>
            </label>
          </React.Fragment>
        ))}
        <div className="glider-container">
          <div className="glider" />
        </div>
      </div>
    </StyledSidebar>
  );
}

const StyledSidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 0; /* Adjusted to top */
  height: 100vh; /* Full viewport height */
  width: 250px;
  background: rgb(13, 13, 13);
  padding: 20px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  .sidebar-logo {
    padding: 0.5rem; /* Reduced padding */
    text-align: center;
    margin-bottom: 1.5rem; /* Reduced margin */
    
    .logo-img {
      max-width: 150px;
    }
  }

  .radio-container {
    --main-color: #f7e479;
    --main-color-opacity: #f7e4791c;
    --total-radio: ${props => props.options?.length || baseOptions.length};
    display: flex;
    flex-direction: column;
    position: relative;
    padding-left: 0.5rem;
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
    position: absolute;
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
    height: 3.5rem;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    position: relative;
    
    .nav-link {
      color: grey;
      text-decoration: none;
      transition: color 0.2s ease;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 10px;

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
      transform: translateY(calc(${i} * 3.5rem));
    }
  `).join('')}
`;
