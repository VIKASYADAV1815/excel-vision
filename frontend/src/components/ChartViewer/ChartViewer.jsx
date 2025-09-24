import React, { useState, useContext, useEffect, useRef } from 'react';
import { UploadContext } from '../Uploads/UploadContext';
import ChartRenderer from '../Charts/ChartRenderer.jsx'; // Fixed import path
import ChartSelector from '../Charts/ChartSelector';
import ChartUploader from '../Charts/ChartUploader';
import './ChartViewer.css';
import Spinner from '../Dashboard/Spinner';

// Helper function to create gradient colors for Chart.js
const createGradient = (ctx, chartArea, colorStops) => {
  if (!chartArea) return 'rgba(79, 140, 255, 0.8)';
  
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  colorStops.forEach(stop => {
    gradient.addColorStop(stop.offset, stop.color);
  });
  return gradient;
};

// Professional gradient color schemes
const gradientSchemes = {
  blue: [
    { offset: 0, color: 'rgba(79, 140, 255, 0.8)' },
    { offset: 1, color: 'rgba(118, 75, 162, 0.8)' }
  ],
  purple: [
    { offset: 0, color: 'rgba(240, 147, 251, 0.8)' },
    { offset: 1, color: 'rgba(245, 87, 108, 0.8)' }
  ],
  cyan: [
    { offset: 0, color: 'rgba(79, 172, 254, 0.8)' },
    { offset: 1, color: 'rgba(0, 242, 254, 0.8)' }
  ],
  green: [
    { offset: 0, color: 'rgba(119, 221, 119, 0.8)' },
    { offset: 1, color: 'rgba(34, 193, 195, 0.8)' }
  ],
  orange: [
    { offset: 0, color: 'rgba(255, 179, 71, 0.8)' },
    { offset: 1, color: 'rgba(255, 105, 97, 0.8)' }
  ]
};

// Fallback uploaded files data with gradient colors
const uploadedFiles = [
  { 
    filename: 'Sales_Q1.xlsx', 
    data: { 
      labels: ['Jan', 'Feb', 'Mar'], 
      datasets: [{ 
        label: 'Sales', 
        data: [120, 150, 180], 
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderColor: '#667eea',
        borderWidth: 2
      }] 
    } 
  },
  { 
    filename: 'Inventory_May.xlsx', 
    data: { 
      labels: ['Week 1', 'Week 2', 'Week 3'], 
      datasets: [{ 
        label: 'Inventory', 
        data: [80, 60, 90], 
        backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderColor: '#f093fb',
        borderWidth: 2
      }] 
    } 
  },
  { 
    filename: 'Budget2024.xlsx', 
    data: { 
      labels: ['Q1', 'Q2', 'Q3'], 
      datasets: [{ 
        label: 'Budget', 
        data: [200, 220, 210], 
        backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        borderColor: '#4facfe',
        borderWidth: 2
      }] 
    } 
  },
];

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: { 
      display: true, 
      position: window.innerWidth < 768 ? 'bottom' : 'top',
      labels: {
        color: '#e3e3e3',
        font: {
          size: window.innerWidth < 480 ? 10 : window.innerWidth < 768 ? 12 : 14
        },
        padding: window.innerWidth < 768 ? 8 : 20,
        boxWidth: window.innerWidth < 480 ? 12 : 20,
        usePointStyle: window.innerWidth < 480
      }
    },
    title: { 
      display: true, 
      text: 'Chart Preview', 
      color: '#e3e3e3', 
      font: { 
        size: window.innerWidth < 480 ? 14 : window.innerWidth < 768 ? 16 : 18 
      },
      padding: {
        top: 10,
        bottom: window.innerWidth < 768 ? 15 : 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      titleColor: '#e3e3e3',
      bodyColor: '#e3e3e3',
      borderColor: '#4f8cff',
      borderWidth: 1,
      titleFont: {
        size: window.innerWidth < 480 ? 12 : 14
      },
      bodyFont: {
        size: window.innerWidth < 480 ? 11 : 13
      },
      padding: window.innerWidth < 480 ? 8 : 12,
      displayColors: window.innerWidth > 480
    }
  },
  scales: {
    x: { 
      ticks: { 
        color: '#e3e3e3',
        font: {
          size: window.innerWidth < 480 ? 9 : window.innerWidth < 768 ? 10 : 12
        },
        maxRotation: window.innerWidth < 768 ? 45 : 0,
        minRotation: 0
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        lineWidth: window.innerWidth < 480 ? 0.5 : 1
      }
    },
    y: { 
      ticks: { 
        color: '#e3e3e3',
        font: {
          size: window.innerWidth < 480 ? 9 : window.innerWidth < 768 ? 10 : 12
        },
        maxTicksLimit: window.innerWidth < 480 ? 5 : 8
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        lineWidth: window.innerWidth < 480 ? 0.5 : 1
      }
    },
  },
  elements: {
    point: {
      radius: window.innerWidth < 480 ? 2 : window.innerWidth < 768 ? 3 : 5,
      hoverRadius: window.innerWidth < 480 ? 4 : window.innerWidth < 768 ? 5 : 7,
      borderWidth: window.innerWidth < 480 ? 1 : 2
    },
    line: {
      borderWidth: window.innerWidth < 480 ? 1.5 : window.innerWidth < 768 ? 2 : 3,
      tension: 0.1
    },
    bar: {
      borderWidth: window.innerWidth < 480 ? 0.5 : window.innerWidth < 768 ? 1 : 2,
      borderRadius: window.innerWidth < 480 ? 2 : 4
    },
    arc: {
      borderWidth: window.innerWidth < 480 ? 1 : 2
    }
  },
  onResize: (chart, size) => {
    const isMobile = size.width < 768;
    const isSmallMobile = size.width < 480;
    
    chart.options.plugins.legend.position = isMobile ? 'bottom' : 'top';
    chart.options.plugins.legend.labels.font.size = isSmallMobile ? 10 : isMobile ? 12 : 14;
    chart.options.plugins.legend.labels.boxWidth = isSmallMobile ? 12 : 20;
    chart.options.plugins.legend.labels.usePointStyle = isSmallMobile;
    
    chart.options.plugins.title.font.size = isSmallMobile ? 14 : isMobile ? 16 : 18;
    
    chart.options.scales.x.ticks.font.size = isSmallMobile ? 9 : isMobile ? 10 : 12;
    chart.options.scales.y.ticks.font.size = isSmallMobile ? 9 : isMobile ? 10 : 12;
    
    chart.options.elements.point.radius = isSmallMobile ? 2 : isMobile ? 3 : 5;
    chart.options.elements.line.borderWidth = isSmallMobile ? 1.5 : isMobile ? 2 : 3;
    chart.options.elements.bar.borderWidth = isSmallMobile ? 0.5 : isMobile ? 1 : 2;
    
    chart.update('none');
  }
};

const ChartViewer = ({ bgImage }) => {
  const { uploadedData } = useContext(UploadContext);
  const [chartType, setChartType] = useState('line'); // Changed default chart type
  const [selectedFile, setSelectedFile] = useState('Inventory_May.xlsx');
  const [xCol, setXCol] = useState('');
  const [yCol, setYCol] = useState('');
  const [loading, setLoading] = useState(true);
  const chartRef = useRef();
  const [downloadChecked, setDownloadChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (uploadedData && uploadedData.headers && uploadedData.headers.length > 0) {
      if (!xCol && uploadedData.headers.length > 0) {
        setXCol(uploadedData.headers[0]);
      }
      if (!yCol && uploadedData.headers.length > 1) {
        setYCol(uploadedData.headers[1]);
      }
    }
  }, [uploadedData, xCol, yCol]);

  const processChartData = () => {
    if (uploadedData && uploadedData.headers && uploadedData.headers.length > 0 && uploadedData.rows && uploadedData.rows.length > 0) {
      if (xCol && yCol) {
        const xIndex = uploadedData.headers.indexOf(xCol);
        const yIndex = uploadedData.headers.indexOf(yCol);
        
        const labels = uploadedData.rows.map(row => String(row[xIndex] || ''));
        const data = uploadedData.rows.map(row => Number(row[yIndex]) || 0);
        
        return {
          labels,
          datasets: [{
            label: yCol,
            data,
            backgroundColor: 'rgba(79, 140, 255, 0.8)',
            borderColor: '#4f8cff',
            borderWidth: 2,
            fill: true
          }]
        };
      }
    }
    return null;
  };

  const chartData = processChartData();
  const fileData = uploadedFiles.find(f => f.filename === selectedFile)?.data;

  const handleDownloadChart = () => {
    setDownloadChecked(true);
    setTimeout(() => setDownloadChecked(false), 4000);
    const canvas = document.querySelector('.chart-render-area canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chart.png';
      link.click();
    }
  };

  return (
    <div className="chart-viewer" style={bgImage ? {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      minHeight: '100vh',
      boxShadow: '0 8px 32px 8px rgba(0,0,0,0.55)'
    } : {}}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <Spinner />
        </div>
      ) : (
        <>
          <div className="chart-controls">
            {uploadedData && uploadedData.headers && uploadedData.headers.length > 1 ? (
              <>
                <div className="chart-uploader">
                  <label htmlFor="x-col-select">X Axis:</label>
                  <select id="x-col-select" value={xCol} onChange={e => setXCol(e.target.value)}>
                    <option value="">Select column</option>
                    {uploadedData.headers.map((header, idx) => (
                      <option key={idx} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
                <div className="chart-uploader">
                  <label htmlFor="y-col-select">Y Axis:</label>
                  <select id="y-col-select" value={yCol} onChange={e => setYCol(e.target.value)}>
                    <option value="">Select column</option>
                    {uploadedData.headers.map((header, idx) => (
                      <option key={idx} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
                <ChartSelector value={chartType} onChange={setChartType} />
              </>
            ) : (
              <>
                <ChartUploader files={uploadedFiles} value={selectedFile} onChange={setSelectedFile} />
                <ChartSelector value={chartType} onChange={setChartType} />
              </>
            )}
          </div>
          <div className={`chart-render-area${chartType === 'pie' ? ' pie-chart-area' : ''}`}>
            {chartData ? (
              <ChartRenderer type={chartType} data={chartData} options={defaultOptions} />
            ) : fileData ? (
              <ChartRenderer type={chartType} data={fileData} options={defaultOptions} />
            ) : (
              <ChartRenderer type={chartType} data={uploadedFiles[0].data} options={defaultOptions} />
            )}
          </div>
          <div className="download-btn-wrapper">
            <button className="modern-download-btn" onClick={handleDownloadChart} type="button">
              <span className="modern-download-icon">
                <svg
                  className="icon"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="28" height="28"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 19V5m0 14-4-4m4 4 4-4"
                  ></path>
                </svg>
              </span>
              <span className="modern-download-label">Download</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartViewer;
