import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        toast.error('Please login to access this page');
        navigate('/login');
        return;
      }

      try {
        // Verify token is valid JSON
        JSON.parse(user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        toast.error('Session expired. Please login again');
        navigate('/login');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#181c24'
      }}>
        <div style={{ color: '#fff', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default AuthGuard;
