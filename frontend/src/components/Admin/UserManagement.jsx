import React, { useState, useEffect } from 'react';
import { fetchAllUsers, blockUser, deleteUser, updateUserRole } from '../../api';
import { toast } from 'react-toastify';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMobileInfo, setShowMobileInfo] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetchAllUsers(token);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const token = localStorage.getItem('token');
      await blockUser(userId, isBlocked, token);
      toast.success(`User ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
      loadUsers();
    } catch (err) {
      toast.error('Failed to update user status');
      console.error('Error blocking user:', err);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('token');
        await deleteUser(userId, token);
        toast.success('User deleted successfully');
        loadUsers();
      } catch (err) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await updateUserRole(userId, newRole, token);
      toast.success(`User role updated to ${newRole}`);
      loadUsers();
    } catch (err) {
      toast.error('Failed to update user role');
      console.error('Error updating role:', err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && !user.isBlocked) ||
                         (filterStatus === 'blocked' && user.isBlocked);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="user-management-loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management-error">
        <p>{error}</p>
        <button onClick={loadUsers} className="retry-btn">Retry</button>
      </div>
    );
  }

  const renderMobileUserCard = (user) => (
    <div className="mobile-user-card" key={user._id}>
      <div className="mobile-user-header">
        <div className="user-info">
          <img
            src={user.profilePic || 'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png'}
            alt={user.username}
            className="user-avatar"
          />
          <div>
            <div className="username">{user.username}</div>
            {user.name && <div className="user-name">{user.name}</div>}
          </div>
        </div>
        <button 
          className="mobile-expand-btn"
          onClick={() => setShowMobileInfo(showMobileInfo === user._id ? null : user._id)}
        >
          {showMobileInfo === user._id ? '▼' : '▶'}
        </button>
      </div>

      {showMobileInfo === user._id && (
        <div className="mobile-user-details">
          <div className="mobile-detail-row">
            <span>Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="mobile-detail-row">
            <span>Role:</span>
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user._id, e.target.value)}
              className={`role-select ${user.role}`}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mobile-detail-row">
            <span>Status:</span>
            <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
              {user.isBlocked ? 'Blocked' : 'Active'}
            </span>
          </div>
          <div className="mobile-detail-row">
            <span>Last Login:</span>
            <span>{formatDate(user.lastLogin)}</span>
          </div>
          <div className="mobile-detail-row">
            <span>Joined:</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>
          <div className="mobile-actions">
            <button
              onClick={() => handleBlockUser(user._id, !user.isBlocked)}
              className={`action-btn ${user.isBlocked ? 'unblock-btn' : 'block-btn'}`}
            >
              {user.isBlocked ? '🔓 Unblock' : '🔒 Block'}
            </button>
            <button
              onClick={() => handleDeleteUser(user._id, user.username)}
              className="action-btn delete-btn"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h3>User Management</h3>
        <div className="user-filters">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Desktop View */}
      <div className="desktop-view">
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id} className={user.isBlocked ? 'blocked-user' : ''}>
                  <td>
                    <div className="user-info">
                      <img
                        src={user.profilePic || 'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png'}
                        alt={user.username}
                        className="user-avatar"
                      />
                      <div>
                        <div className="username">{user.username}</div>
                        {user.name && <div className="user-name">{user.name}</div>}
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`role-select ${user.role}`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>{formatDate(user.lastLogin)}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleBlockUser(user._id, !user.isBlocked)}
                        className={`action-btn ${user.isBlocked ? 'unblock-btn' : 'block-btn'}`}
                        title={user.isBlocked ? 'Unblock user' : 'Block user'}
                      >
                        {user.isBlocked ? '🔓' : '🔒'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.username)}
                        className="action-btn delete-btn"
                        title="Delete user"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="mobile-view">
        <div className="mobile-users-container">
          {filteredUsers.map(user => renderMobileUserCard(user))}
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-users">
          <p>No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;