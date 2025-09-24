import React, { useEffect, useState } from 'react';
import KpiCard from './KpiCard';
import RecentUploads from './RecentUploads';
import ChartViewer from "../ChartViewer/ChartViewer";
import './Dashboard.css';
import bgImg from '../../assets/bg.png';
import { fetchKpis, fetchUploads } from '../../api';
import Uploads from '../Uploads/Upload';

function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

const Dashboard = () => {
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refreshKey state

  const refreshDashboardData = () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    Promise.all([
      fetchKpis(token).then(res => res.data).catch(() => null),
      fetchUploads(token).then(res => res.data).catch(() => null)
    ]).then(([kpiData, uploadData]) => {
      setKpis(kpiData || []);
      setUploads(uploadData || []);
      setLoading(false);
    }).catch(err => {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshDashboardData();
  }, [refreshKey]); // Add refreshKey as dependency

  return (
    <div className="dashboard-container">
      <div className="dashboard-main-grid">
        <div className="dashboard-left">
          <div className="kpi-grid">
            {loading
              ? Array(4).fill(0).map((_, idx) => <KpiCard key={idx} loading />)
              : kpis.length
                ? kpis.map((kpi, idx) => <KpiCard key={kpi.label || idx} {...kpi} />)
                : <KpiCard empty />
            }
          </div>
          <RecentUploads uploads={uploads} loading={loading} />
        </div>
        <div className="dashboard-chart-area">
          <ChartViewer />
        </div>
      </div>
      {error && <div className="dashboard-error">{error}</div>}
    </div>
  );
};

export default Dashboard;
