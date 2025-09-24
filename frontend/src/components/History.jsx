import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './ChartViewer/ChartViewer.css';
import './History.css';
import { fetchHistory, downloadFile } from '../api';
import ChartRenderer from './Charts/ChartRenderer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart } from 'chart.js/auto';

const chartTypes = ['Line', 'Pie', 'Bar'];
const statuses = ['Success', 'Failed']; // Simulated for demo

const History = ({ refreshKey }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [modalChart, setModalChart] = useState(null);
  const chartRefs = useRef({});
  const pollingRef = useRef();
  const [modalChartInstance, setModalChartInstance] = useState(null);

  // Fetch history from backend
  const loadHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetchHistory(token);
      setHistory(res.data || []);
    } catch (err) {
      setHistory([]);
    }
    setLoading(false);
  };

  // Polling for updates every 30 seconds and refresh on refreshKey
  useEffect(() => {
    loadHistory();
    pollingRef.current = setInterval(loadHistory, 30000); // 30 seconds
    return () => clearInterval(pollingRef.current);
  }, [refreshKey]);

  // Search and sort logic
  const filtered = history
    .filter(item => item.filename.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (sortBy === 'date') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Enhanced chart download as PNG with proper data rendering
  const handleDownload = async (item) => {
    try {
      // Use actual data from the item or create meaningful sample data
      const labels = item.labels || item.data?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const data = item.data?.datasets?.[0]?.data || item.data || [65, 59, 80, 81, 56];
      const chartType = (item.chartType || 'Bar').toLowerCase();
      
      // Create temporary canvas with proper sizing
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      canvas.style.position = 'absolute';
      canvas.style.left = '-9999px';
      canvas.style.backgroundColor = '#ffffff';
      document.body.appendChild(canvas);
      
      // Enhanced chart configuration with gradients
      const chartData = {
        labels,
        datasets: [{
          label: item.filename || 'Data',
          data,
          backgroundColor: chartType === 'pie' || chartType === 'doughnut' ? [
            'rgba(79,140,255,0.8)',
            'rgba(118,75,162,0.8)',
            'rgba(255,179,71,0.8)',
            'rgba(255,105,97,0.8)',
            'rgba(119,221,119,0.8)',
            'rgba(240,147,251,0.8)',
            'rgba(174,198,207,0.8)'
          ] : (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(79,140,255,0.8)';
            
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, 'rgba(79,140,255,0.8)');
            gradient.addColorStop(1, 'rgba(118,75,162,0.8)');
            return gradient;
          },
          borderColor: chartType === 'pie' || chartType === 'doughnut' ? '#fff' : '#4f8cff',
          borderWidth: 2,
          fill: chartType === 'line' ? true : false,
          tension: chartType === 'line' ? 0.4 : undefined
        }],
      };
      
      const chartOptions = {
        responsive: false,
        maintainAspectRatio: false,
        animation: {
          duration: 0 // Disable animations for download
        },
        plugins: {
          legend: { 
            display: true,
            position: 'top',
            labels: {
              color: '#333333',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: 20
            }
          },
          title: { 
            display: true, 
            text: `${item.filename} (${item.chartType || 'Bar'} Chart)`,
            color: '#333333',
            font: {
              size: 20,
              weight: 'bold'
            },
            padding: {
              top: 20,
              bottom: 30
            }
          },
        },
        scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
          x: {
            ticks: {
              color: '#333333',
              font: {
                size: 14
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          y: {
            ticks: {
              color: '#333333',
              font: {
                size: 14
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        } : {}
      };
      
      // Create and render chart
      const chart = new Chart(canvas.getContext('2d'), {
        type: chartType,
        data: chartData,
        options: chartOptions
      });
      
      // Wait for render and download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png', 1.0);
        link.download = `${item.filename}-${chartType}-chart.png`;
        link.click();
        
        // Cleanup
        chart.destroy();
        document.body.removeChild(canvas);
      }, 1000);
      
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download chart.');
    }
  };

  // Download original Excel file
  const handleExcelDownload = async (item) => {
    try {
      const token = localStorage.getItem('token');
      const res = await downloadFile(item.fileId || item.id || item._id, token);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', item.filename || 'file.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download file.');
    }
  };

  // View chart in modal (render actual chart)
  useEffect(() => {
    if (showModal && modalChart) {
      // Clean up previous chart instance
      if (modalChartInstance) {
        modalChartInstance.destroy();
      }
      const ctx = document.getElementById('modal-chart-canvas')?.getContext('2d');
      if (ctx) {
        const labels = modalChart.labels || ['A', 'B', 'C'];
        const data = modalChart.data || [12, 19, 3];
        const chartType = (modalChart.chartType || 'Bar').toLowerCase();
        const instance = new Chart(ctx, {
          type: chartType,
          data: {
            labels,
            datasets: [{
              label: modalChart.filename,
              data,
              backgroundColor: [
                'rgba(79,140,255,0.7)',
                'rgba(118,75,162,0.7)',
                'rgba(227,227,227,0.7)'
              ],
              borderColor: '#fff',
              borderWidth: 2,
            }],
          },
          options: {
            responsive: false,
            plugins: {
              legend: { display: true },
              title: { display: true, text: `${modalChart.filename} (${modalChart.chartType || 'Bar'})` },
            },
          },
        });
        setModalChartInstance(instance);
      }
    }
    // Clean up on close
    return () => {
      if (modalChartInstance) {
        modalChartInstance.destroy();
        setModalChartInstance(null);
      }
    };
    // eslint-disable-next-line
  }, [showModal, modalChart]);

  // Update handleDelete to delete from backend and refresh history
  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/history/${itemId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          // Refresh history from backend
          loadHistory();
        } else {
          alert('Failed to delete.');
        }
      } catch (err) {
        alert('Failed to delete.');
      }
    }
  };

  // Download specific chart type for a file
  const handleDownloadSpecificChart = async (item, chartType) => {
    try {
      const labels = item.labels || ['A', 'B', 'C', 'D', 'E'];
      const data = item.data || [12, 19, 3, 5, 2];
      
      // Create a temporary container for chart rendering
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '800px';
      tempContainer.style.height = '600px';
      tempContainer.style.backgroundColor = '#ffffff';
      document.body.appendChild(tempContainer);
      
      // Create chart data
      const chartData = {
        labels,
        datasets: [{
          label: item.filename,
          data,
          backgroundColor: [
            'rgba(79,140,255,0.8)',
            'rgba(118,75,162,0.8)',
            'rgba(255,179,71,0.8)',
            'rgba(255,105,97,0.8)',
            'rgba(119,221,119,0.8)',
            'rgba(244,154,194,0.8)'
          ],
          borderColor: '#fff',
          borderWidth: 2,
        }],
      };
      
      const chartOptions = {
        responsive: false,
        animation: false,
        plugins: {
          legend: { display: true },
          title: { display: true, text: `${item.filename} (${chartType})` },
        },
      };
      
      // Create a React element for the chart
      const chartElement = React.createElement(ChartRenderer, {
        type: chartType,
        data: chartData,
        options: chartOptions
      });
      
      // Render the chart element to the container
      const root = createRoot(tempContainer);
      root.render(chartElement);
      
      // Wait for chart to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capture the chart using html2canvas
      const chartCanvas = await html2canvas(tempContainer, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      });
      
      const url = chartCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.filename}-${chartType}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      root.unmount();
      document.body.removeChild(tempContainer);
      
    } catch (err) {
      console.error('Error downloading chart:', err);
      alert('Failed to generate chart image.');
      if (tempContainer && document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    }
  };

  // Enhanced PDF download with proper chart rendering
  const handleDownloadPDF = async (item) => {
    try {
      const labels = item.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const data = item.data || [65, 59, 80, 81, 56];
      
      // Create temporary container for chart
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.height = '600px';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.padding = '20px';
      document.body.appendChild(tempContainer);
      
      // Create canvas for chart
      const canvas = document.createElement('canvas');
      canvas.width = 760;
      canvas.height = 500;
      canvas.style.backgroundColor = '#ffffff';
      tempContainer.appendChild(canvas);
      
      // Enhanced chart configuration
      const chartData = {
        labels,
        datasets: [{
          label: item.filename || 'Data',
          data,
          backgroundColor: [
            'rgba(79,140,255,0.8)',
            'rgba(118,75,162,0.8)',
            'rgba(255,179,71,0.8)',
            'rgba(255,105,97,0.8)',
            'rgba(119,221,119,0.8)',
            'rgba(173,216,230,0.8)',
            'rgba(255,182,193,0.8)'
          ],
          borderColor: [
            'rgba(79,140,255,1)',
            'rgba(118,75,162,1)',
            'rgba(255,179,71,1)',
            'rgba(255,105,97,1)',
            'rgba(119,221,119,1)',
            'rgba(173,216,230,1)',
            'rgba(255,182,193,1)'
          ],
          borderWidth: 2,
        }],
      };
      
      const chartOptions = {
        responsive: false,
        maintainAspectRatio: false,
        animation: {
          duration: 0 // Disable animations for PDF
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
          title: { 
            display: true, 
            text: `${item.filename} Chart`,
            color: '#333333',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#333333',
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          y: {
            ticks: {
              color: '#333333',
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      };
      
      // Create chart instance
      const chart = new Chart(canvas.getContext('2d'), {
        type: (item.chartType || 'bar').toLowerCase(),
        data: chartData,
        options: chartOptions
      });
      
      // Wait for chart to fully render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capture the entire container using html2canvas
      const chartImage = await html2canvas(tempContainer, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true
      });
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = chartImage.toDataURL('image/png');
      
      // Add title to PDF
      pdf.setFontSize(20);
      pdf.setTextColor(51, 51, 51);
      pdf.text(`Chart Report: ${item.filename}`, 20, 25);
      
      // Add date
      pdf.setFontSize(12);
      pdf.setTextColor(102, 102, 102);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
      
      // Calculate image dimensions to fit PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 40; // 20mm margin on each side
      const imgHeight = (chartImage.height * imgWidth) / chartImage.width;
      
      // Add chart image to PDF
      pdf.addImage(imgData, 'PNG', 20, 45, imgWidth, Math.min(imgHeight, pdfHeight - 65));
      
      // Save PDF
      pdf.save(`${item.filename || 'chart'}-report.pdf`);
      
      // Cleanup
      chart.destroy();
      document.body.removeChild(tempContainer);
      
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="chart-viewer" style={{ margin: '2.5rem auto', maxWidth: 900 }}>
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: 24 }}>Upload & Analysis History</h2>
      {/* Controls: Search, Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5em 1em', borderRadius: 10, border: '1.2px solid #4f8cff', background: 'rgba(35,39,47,0.45)', color: '#e3e3e3', fontSize: '1rem', minWidth: 180 }}
        />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="glassy-dropdown">
            <option value="date">Date</option>
            <option value="filename">File Name</option>
            <option value="chartType">Chart Type</option>
          </select>
          <button style={{ fontSize: '1rem', padding: '0.4em 1.2em', borderRadius: 18, border: '1px solid #4f8cff', background: 'transparent', color: '#4f8cff', cursor: 'pointer' }} onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: 'rgba(30,30,30,0.18)', borderRadius: 16, boxShadow: '0 2px 24px 0 rgba(0,0,0,0.10)' }}>
          <thead>
            <tr style={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem', background: 'rgba(91,91,240,0.13)' }}>
              <th style={{ padding: '0.8em 1em', textAlign: 'left' }}>File Name</th>
              <th style={{ padding: '0.8em 1em', textAlign: 'left' }}>Upload Date</th>
              <th style={{ padding: '0.8em 1em', textAlign: 'left' }}>Chart Type</th>
              <th style={{ padding: '0.8em 1em', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#b0b3b8' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#b0b3b8' }}>No history found.</td></tr>
            ) : filtered.map((item, idx) => (
              <tr key={item.id || item._id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
                <td style={{ padding: '0.7em 1em', color: '#e3e3e3', fontWeight: 500 }}>{item.filename}</td>
                <td style={{ padding: '0.7em 1em', color: '#b0b3b8' }}>{item.date || item.uploadDate}</td>
                <td style={{ padding: '0.7em 1em', color: '#b0b3b8' }}>
                  <span className="chart-type-badge">{item.chartType && item.chartType !== 'N/A' ? item.chartType : 'Bar'}</span>
                </td>
                <td style={{ padding: '0.7em 1em', textAlign: 'center', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                  {/* Download PNG Button */}
                  <button 
                    onClick={() => handleDownload(item)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5em',
                      background: 'rgba(79, 140, 255, 0.18)', 
                      border: '1.2px solid rgb(79, 140, 255)', 
                      color: '#fff', 
                      fontSize: '0.9rem', 
                      fontWeight: 500, 
                      borderRadius: 20, 
                      padding: '0.4em 1em', 
                      cursor: 'pointer',
                      transition: '0.2s ease-in-out',
                      marginRight: '0.5rem'
                    }}
                    onMouseOver={e => e.target.style.background = 'rgba(79, 140, 255, 0.32)'}
                    onMouseOut={e => e.target.style.background = 'rgba(79, 140, 255, 0.18)'}
                  >
                    <span>📊</span>
                    PNG
                  </button>
                  {/* Download PDF Button */}
                  <button 
                    onClick={() => handleDownloadPDF(item)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5em',
                      background: 'rgba(255, 99, 132, 0.18)', 
                      border: '1.2px solid rgb(255, 99, 132)', 
                      color: '#fff', 
                      fontSize: '0.9rem', 
                      fontWeight: 500, 
                      borderRadius: 20, 
                      padding: '0.4em 1em', 
                      cursor: 'pointer',
                      transition: '0.2s ease-in-out',
                      marginRight: '0.5rem'
                    }}
                    onMouseOver={e => e.target.style.background = 'rgba(255, 99, 132, 0.32)'}
                    onMouseOut={e => e.target.style.background = 'rgba(255, 99, 132, 0.18)'}
                  >
                    <span>📄</span>
                    PDF
                  </button>
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(item.id || item._id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5em',
                      background: 'rgba(255, 99, 132, 0.18)', 
                      border: '1.2px solid rgb(255, 99, 132)', 
                      color: '#fff', 
                      fontSize: '0.9rem', 
                      fontWeight: 500, 
                      borderRadius: 20, 
                      padding: '0.4em 1em', 
                      cursor: 'pointer',
                      transition: '0.2s ease-in-out'
                    }}
                    onMouseOver={e => e.target.style.background = 'rgba(255, 99, 132, 0.32)'}
                    onMouseOut={e => e.target.style.background = 'rgba(255, 99, 132, 0.18)'}
                  >
                    <span>🗑️</span>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Chart Preview Modal */}
      {showModal && modalChart && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#23272f', borderRadius: 12, padding: 24, minWidth: 400 }}>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>{modalChart.filename} ({(!modalChart.chartType || modalChart.chartType === 'N/A') ? 'Bar' : modalChart.chartType})</h3>
            <canvas
              id="modal-chart-canvas"
              key={modalChart.id || modalChart._id || modalChart.filename}
              width="600"
              height="400"
              style={{ background: '#222', borderRadius: 12, marginBottom: 16 }}
            ></canvas>
            <button style={{ marginTop: 18, fontSize: '1rem', padding: '0.4em 1.2em', borderRadius: 18, border: '1px solid #4f8cff', background: 'transparent', color: '#4f8cff', cursor: 'pointer' }} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;