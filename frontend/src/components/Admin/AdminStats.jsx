import React, { useState, useEffect } from 'react';
import { fetchAdminStats } from '../../api';
import './AdminStats.css';
import AdminCharts from './AdminCharts';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetchAdminStats(token);
      setStats(response.data);
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-stats-loading">
        <div className="spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-stats-error">
        <p>{error}</p>
        <button onClick={loadStats} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-stats">
      <h3 className="stats-title">Platform Statistics</h3>
      <div className="stats-container">
        <div className="stats-grid">
          <div className="stat-card total-users">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h4 className="stat-heading">Total Users</h4>
              <p className="stat-number">{stats?.totalUsers || 0}</p>
            </div>
          </div>
          
          <div className="stat-card active-users">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h4 className="stat-heading">Active Users</h4>
              <p className="stat-number">{stats?.activeUsers || 0}</p>
            </div>
          </div>
          
          <div className="stat-card blocked-users">
            <div className="stat-icon">🚫</div>
            <div className="stat-content">
              <h4 className="stat-heading">Blocked Users</h4>
              <p className="stat-number">{stats?.blockedUsers || 0}</p>
            </div>
          </div>
          
          <div className="stat-card admin-users">
            <div className="stat-icon">👑</div>
            <div className="stat-content">
              <h4 className="stat-heading">Admin Users</h4>
              <p className="stat-number">{stats?.adminUsers || 0}</p>
            </div>
          </div>
          
          <div className="stat-card recent-registrations">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h4 className="stat-heading">New Users (7 days)</h4>
              <p className="stat-number">{stats?.recentRegistrations || 0}</p>
            </div>
          </div>
          
          <div className="stat-card recently-active">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h4 className="stat-heading">Active Today</h4>
              <p className="stat-number">{stats?.recentlyActive || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="charts-container">
          <AdminCharts stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default AdminStats;