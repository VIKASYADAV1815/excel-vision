import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './components/ChartViewer/ChartViewer.css';

import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import AuthGuard from './components/AuthGuard';

import Home from './Pages/Home/home';
import Admin from './Pages/Admin/Admin';
import { Login, Register } from './Pages/Login';
import Uploads from './components/Uploads/Upload';
import Dashboard from './components/Dashboard/Dashboard';
import ChartViewer from './components/ChartViewer/ChartViewer';
import Profile from './Pages/Profile/Profile';
import EditProfile from './Pages/Profile/EditProfile';
import { UploadProvider } from './components/Uploads/UploadContext';
import bg2 from './assets/bg2.jpg';
import bgg from './assets/bgg.jpg';
import History from './components/History';
import Settings from './Pages/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add refreshKey for triggering refreshes
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Function to trigger refresh
  const handleRefresh = () => setRefreshKey(k => k + 1);

  if (isAuthPage) {
    return (
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }

  return (
    <UploadProvider>
      <div className="app">
        <AuthGuard>
          <Navbar onHamburgerClick={() => setSidebarOpen(true)} />
          <div className="main">
            <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="content-center">
              <div className="content">
                <Routes>
                  <Route path="/" element={
                    <div style={{
                      backgroundImage: `url(${bgg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: '100%',
                      minHeight: '100%',
                      padding: '2rem',
                      boxSizing: 'border-box'
                    }}>
                      <Dashboard refreshKey={refreshKey} />
                    </div>
                  } />
                  <Route path="/home" element={<Home />} />
                  <Route path="/uploads" element={
                    <div style={{
                      backgroundImage: `url(${bg2})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: '100%',
                      minHeight: '100%',
                      padding: '2rem',
                      boxSizing: 'border-box'
                    }}>
                      <Uploads bgImage={bg2} onUploadSuccess={handleRefresh} />
                    </div>
                  } />
                  <Route path="/charts" element={
                    <div style={{
                      backgroundImage: `url(${bg2})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: '100%',
                      minHeight: '100%',
                      padding: '2rem',
                      boxSizing: 'border-box'
                    }}>
                      <ChartViewer bgImage={bg2} />
                    </div>
                  } />
                  <Route path="/history" element={
                    <div style={{
                      backgroundImage: `url(${bg2})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: '100%',
                      minHeight: '100%',
                      padding: '2rem',
                      boxSizing: 'border-box'
                    }}>
                      <History refreshKey={refreshKey} />
                    </div>
                  } />
                  <Route path="/settings" element={
                    <div style={{
                      backgroundImage: `url(${bg2})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: '100%',
                      minHeight: '100%',
                      padding: '2rem',
                      boxSizing: 'border-box'
                    }}>
                      <Settings />
                    </div>
                  } />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </div>
            </div>
          </div>
          <Footer />
        </AuthGuard>
      </div>
    </UploadProvider>
  );
}

export default App;
