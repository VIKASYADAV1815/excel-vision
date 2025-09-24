import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './AdminCharts.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminCharts = ({ stats }) => {
  if (!stats) return null;
  
  const userDistributionData = {
    labels: ['Active Users', 'Blocked Users', 'Admin Users'],
    datasets: [
      {
        data: [stats.activeUsers || 0, stats.blockedUsers || 0, stats.adminUsers || 0],
        backgroundColor: [
          'rgba(63, 148, 219, 0.8)',  // professional blue
          'rgba(214, 69, 65, 0.8)',   // muted red
          'rgba(76, 175, 80, 0.8)'    // professional green
        ],
        borderColor: [
          'rgba(63, 148, 219, 1)',
          'rgba(214, 69, 65, 1)',
          'rgba(76, 175, 80, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#333333',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333333',
        bodyColor: '#666666',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 15,
        boxPadding: 10,
        usePointStyle: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      }
    }
  };

  const userActivityData = {
    labels: ['New Users (7 days)', 'Active Today'],
    datasets: [
      {
        label: 'User Activity',
        data: [stats.recentRegistrations || 0, stats.recentlyActive || 0],
        backgroundColor: [
          'rgba(103, 58, 183, 0.8)',  // professional purple
          'rgba(255, 152, 0, 0.8)'    // professional orange
        ],
        borderColor: [
          'rgba(103, 58, 183, 1)',
          'rgba(255, 152, 0, 1)'
        ],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#333333',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#333333',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333333',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333333',
        bodyColor: '#666666',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 15,
        boxPadding: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      }
    }
  };

  return (
    <div className="admin-charts">
      <h3 className="charts-title">Analytics Dashboard</h3>
      <div className="charts-container">
        <div className="chart-card">
          <h4 className="chart-heading">User Distribution</h4>
          <div className="chart-wrapper pie-chart">
            <Pie data={userDistributionData} options={pieOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h4 className="chart-heading">User Activity Metrics</h4>
          <div className="chart-wrapper bar-chart">
            <Bar data={userActivityData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;