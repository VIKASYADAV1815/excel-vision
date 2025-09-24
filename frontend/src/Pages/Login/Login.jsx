import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Preloader from '../../components/Preloader';
import { login } from '../../api';
import logo from '../../assets/logo.png';
import bg1 from '../../assets/bg2.jpg';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPreloader, setShowPreloader] = useState(false);
  const [showFade, setShowFade] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setShowPreloader(true);
    
    try {
      if (!form.email || !form.password) {
        setShowPreloader(false);
        setError('Email and password are required');
        return;
      }

      console.log('Attempting login with:', { email: form.email });
      const response = await login(form);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setMessage('Login successful!');
        setForm({ email: '', password: '' });
        
        setTimeout(() => {
          setShowFade(true);
          setTimeout(() => {
            setShowPreloader(false);
            setShowFade(false);
            
            if (response.data.user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          }, 700);
        }, 1000);
        
        toast.success('Login successful!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setShowPreloader(false);
      const errorMessage = err.response?.data?.msg || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Login error:', err);
    }
  };

  if (showPreloader) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#181c24', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
        <Preloader />
        {showFade && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'black',
            opacity: 1,
            animation: 'fadeInBlack 0.7s forwards',
            zIndex: 10000
          }} />
        )}
        <style>{`
          @keyframes fadeInBlack {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <StyledWrapper bg={bg1}>
      <div className="logo-container">
        <img src={logo} alt="Logo" />
      </div>
      <div className="login-box">
        <p>Login</p>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <label>Password</label>
          </div>
          <a href="#" onClick={handleSubmit}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </a>
          {message && <div style={{color: '#4CAF50', marginTop: '20px'}}>{message}</div>}
          {error && <div style={{color: '#f44336', marginTop: '20px'}}>{error}</div>}
        </form>
        <p>Don't have an account? <a href="/register" className="a2">Sign up!</a></p>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .logo-container {
    position: absolute;
    top: 32px;
    left: 32px;
    
    img {
      width: 110px;
    }
  }

  .login-box {
    width: 400px;
    padding: 40px;
    margin: 20px auto;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(13px);
    -webkit-backdrop-filter: blur(13px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1),
      inset 0 0 2px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.8),
        transparent
      );
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      height: 100%;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.8),
        transparent,
        rgba(255, 255, 255, 0.3)
      );
    }
  }

  .login-box p:first-child {
    margin: 0 0 30px;
    padding: 0;
    color:rgb(173, 176, 171);
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .login-box .user-box {
    position: relative;
  }

  .login-box .user-box input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color:rgb(195, 204, 205);
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #00EEFF;
    outline: none;
    background: transparent;
  }

  .login-box .user-box label {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 0;
    font-size: 16px;
    color:rgb(240, 247, 247);
    pointer-events: none;
    transition: .5s;
  }

  .login-box .user-box input:focus ~ label,
  .login-box .user-box input:valid ~ label {
    top: -20px;
    left: 0;
    color:rgb(240, 247, 247);
    font-size: 12px;
  }

  .login-box form a {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
    font-weight: bold;
    color: #4CAF50;
    font-size: 16px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: .5s;
    margin-top: 40px;
    letter-spacing: 3px;
    cursor: pointer;
  }

  .login-box a:hover {
    background: #4CAF50;
    color: #272727;
    border-radius: 5px;
  }

  .login-box a span {
    position: absolute;
    display: block;
  }

  .login-box a span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #4CAF50);
    animation: btn-anim1 1.5s linear infinite;
  }

  @keyframes btn-anim1 {
    0% {
      left: -100%;
    }
    50%,100% {
      left: 100%;
    }
  }

  .login-box a span:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #4CAF50);
    animation: btn-anim2 1.5s linear infinite;
    animation-delay: .375s
  }

  @keyframes btn-anim2 {
    0% {
      top: -100%;
    }
    50%,100% {
      top: 100%;
    }
  }

  .login-box a span:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #4CAF50);
    animation: btn-anim3 1.5s linear infinite;
    animation-delay: .75s
  }

  @keyframes btn-anim3 {
    0% {
      right: -100%;
    }
    50%,100% {
      right: 100%;
    }
  }

  .login-box a span:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #4CAF50);
    animation: btn-anim4 1.5s linear infinite;
    animation-delay: 1.125s
  }

  @keyframes btn-anim4 {
    0% {
      bottom: -100%;
    }
    50%,100% {
      bottom: 100%;
    }
  }

  .login-box p:last-child {
    color:rgb(141, 146, 146);
    font-size: 14px;
  }

  .login-box a.a2 {
    color: #00EEFF;
    text-decoration: none;
  }

  .login-box a.a2:hover {
    background: transparent;
    color: #00BBCC;
    border-radius: 5px;
  }
`;

export default Login;
