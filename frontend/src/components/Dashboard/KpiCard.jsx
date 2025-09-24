import React from 'react';
import './KpiCard.css';
import Spinner from './Spinner';

const KpiCard = ({ label, value, icon, loading, empty }) => {
  if (loading) {
    return <div className="kpi-card-glass"><Spinner /></div>;
  }
  if (empty) {
    return <div className="kpi-card-glass"><div className="empty-state">No data</div></div>;
  }
  return (
    <div className="kpi-card-glass">
      <div className="kpi-value">{icon} {value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
};

export default KpiCard; 