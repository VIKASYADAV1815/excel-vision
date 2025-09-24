import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth
export const login = (data) => axios.post(`${API_BASE}/auth/login`, data);
export const register = (data) => axios.post(`${API_BASE}/auth/register`, data);
export const updateProfile = (data, token) => axios.put(`${API_BASE}/auth/profile`, data, { headers: { Authorization: `Bearer ${token}` } });

// Profile
export const getProfile = (token) => axios.get(`${API_BASE}/profile`, { headers: { Authorization: `Bearer ${token}` } });
export const updateProfileInfo = (data, token) => axios.put(`${API_BASE}/profile`, data, { headers: { Authorization: `Bearer ${token}` } });
export const uploadProfilePhoto = (formData, token) => axios.post(`${API_BASE}/profile/photo`, formData, { 
  headers: { 
    Authorization: `Bearer ${token}`, 
    'Content-Type': 'multipart/form-data' 
  } 
});

// Settings
export const getSettings = (token) => axios.get(`${API_BASE}/settings`, { headers: { Authorization: `Bearer ${token}` } });
export const updatePassword = (data, token) => axios.put(`${API_BASE}/settings/password`, data, { headers: { Authorization: `Bearer ${token}` } });
export const updateProfileSettings = (data, token) => axios.put(`${API_BASE}/settings/profile`, data, { headers: { Authorization: `Bearer ${token}` } });
export const updatePreferences = (data, token) => axios.put(`${API_BASE}/settings/preferences`, data, { headers: { Authorization: `Bearer ${token}` } });

// Uploads
export const fetchUploads = (token) => axios.get(`${API_BASE}/uploads`, { headers: { Authorization: `Bearer ${token}` } });
export const uploadFile = (formData, token) => axios.post(`${API_BASE}/uploads`, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });

// Analyses
export const fetchAnalyses = (token) => axios.get(`${API_BASE}/analyses`, { headers: { Authorization: `Bearer ${token}` } });

// KPI Data
export const fetchKpis = (token) => axios.get(`${API_BASE}/kpis`, { headers: { Authorization: `Bearer ${token}` } });

// History
export const fetchHistory = (token) => axios.get(`${API_BASE}/history`, { headers: { Authorization: `Bearer ${token}` } });

// Download
export const downloadFile = (fileId, token) => axios.get(`${API_BASE}/download/${fileId}`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });

// Admin APIs
export const fetchAllUsers = (token) => axios.get(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
export const fetchAdminStats = (token) => axios.get(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
export const blockUser = (userId, isBlocked, token) => axios.put(`${API_BASE}/admin/users/${userId}/block`, { isBlocked }, { headers: { Authorization: `Bearer ${token}` } });
export const deleteUser = (userId, token) => axios.delete(`${API_BASE}/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
export const updateUserRole = (userId, role, token) => axios.put(`${API_BASE}/admin/users/${userId}/role`, { role }, { headers: { Authorization: `Bearer ${token}` } });
export const fetchUserActivity = (userId, token) => axios.get(`${API_BASE}/admin/users/${userId}/activity`, { headers: { Authorization: `Bearer ${token}` } });