import React, { useEffect, useRef } from 'react';
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register all Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

// Ensure Chart.js is properly initialized
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

const chartMap = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  radar: Radar,
  polarArea: PolarArea,
  scatter: Scatter,
  bubble: Bubble,
};

// Helper function to create 3D effect data
const create3DEffect = (originalData, type) => {
  const newData = { ...originalData };
  
  if (type === 'bar3d') {
    newData.datasets = originalData.datasets.map((dataset, index) => {
      const colors = [
        'rgba(79, 140, 255, 0.9)',
        'rgba(118, 75, 162, 0.9)',
        'rgba(255, 179, 71, 0.9)',
        'rgba(255, 105, 97, 0.9)',
        'rgba(119, 221, 119, 0.9)',
        'rgba(244, 154, 194, 0.9)',
        'rgba(174, 198, 207, 0.9)',
        'rgba(207, 207, 196, 0.9)'
      ];
      
      return {
        ...dataset,
        backgroundColor: Array.isArray(dataset.data) 
          ? dataset.data.map((_, i) => colors[i % colors.length])
          : colors[index % colors.length],
        borderColor: '#fff',
        borderWidth: 3,
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 4,
          bottomRight: 4
        },
        borderSkipped: false,
        // Enhanced shadow effect
        shadowOffsetX: 6,
        shadowOffsetY: 6,
        shadowBlur: 12,
        shadowColor: 'rgba(0,0,0,0.4)',
      };
    });
  } else if (type === 'line3d') {
    newData.datasets = originalData.datasets.map((dataset, index) => {
      const lineColors = [
        { bg: 'rgba(79, 140, 255, 0.2)', border: '#4f8cff', glow: '#4f8cff' },
        { bg: 'rgba(118, 75, 162, 0.2)', border: '#764ba2', glow: '#764ba2' },
        { bg: 'rgba(255, 179, 71, 0.2)', border: '#ffb347', glow: '#ffb347' },
        { bg: 'rgba(255, 105, 97, 0.2)', border: '#ff6961', glow: '#ff6961' }
      ];
      const colorSet = lineColors[index % lineColors.length];
      
      return {
        ...dataset,
        fill: true,
        backgroundColor: colorSet.bg,
        borderColor: colorSet.border,
        borderWidth: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: colorSet.border,
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBorderWidth: 4,
        tension: 0.4,
        // Enhanced glow effect
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 15,
        shadowColor: colorSet.glow,
      };
    });
  } else if (type === 'pie3d') {
    newData.datasets = originalData.datasets.map((dataset, index) => {
      const pieColors = [
        'rgba(79, 140, 255, 0.9)',
        'rgba(118, 75, 162, 0.9)',
        'rgba(255, 179, 71, 0.9)',
        'rgba(255, 105, 97, 0.9)',
        'rgba(119, 221, 119, 0.9)',
        'rgba(244, 154, 194, 0.9)',
        'rgba(174, 198, 207, 0.9)',
        'rgba(207, 207, 196, 0.9)',
        'rgba(179, 157, 219, 0.9)',
        'rgba(255, 206, 84, 0.9)'
      ];
      
      return {
        ...dataset,
        borderWidth: 4,
        borderColor: '#fff',
        hoverBorderWidth: 6,
        hoverOffset: 15,
        backgroundColor: Array.isArray(dataset.data) 
          ? dataset.data.map((_, i) => pieColors[i % pieColors.length])
          : pieColors,
        // Enhanced hover effects
        hoverBackgroundColor: Array.isArray(dataset.data) 
          ? dataset.data.map((_, i) => pieColors[i % pieColors.length].replace('0.9', '1.0'))
          : pieColors.map(color => color.replace('0.9', '1.0')),
      };
    });
  }
  
  return newData;
};

// Helper function to create area chart data
const createAreaData = (originalData) => {
  const newData = { ...originalData };
  newData.datasets = originalData.datasets.map(dataset => ({
    ...dataset,
    fill: true,
    backgroundColor: 'rgba(79, 140, 255, 0.2)',
    borderColor: '#4f8cff',
    borderWidth: 2,
    pointBackgroundColor: '#fff',
    pointBorderColor: '#4f8cff',
    pointBorderWidth: 2,
    pointRadius: 4,
    tension: 0.4,
  }));
  return newData;
};

// Enhanced options for 3D effects
const get3DOptions = (originalOptions, type) => {
  const options = { 
    ...originalOptions,
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart'
    }
  };
  
  if (type === 'bar3d') {
    options.plugins = {
      ...options.plugins,
      legend: {
        ...options.plugins?.legend,
        display: true,
        position: 'top',
        labels: {
          ...options.plugins?.legend?.labels,
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 20,
          color: '#e3e3e3',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4f8cff',
        borderWidth: 2,
        cornerRadius: 8
      }
    };
    options.scales = {
      ...options.scales,
      x: {
        ...options.scales?.x,
        grid: {
          display: true,
          color: 'rgba(255,255,255,0.15)',
          lineWidth: 1
        },
        ticks: {
          color: '#e3e3e3',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y: {
        ...options.scales?.y,
        grid: {
          display: true,
          color: 'rgba(255,255,255,0.15)',
          lineWidth: 1
        },
        ticks: {
          color: '#e3e3e3',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    };
  } else if (type === 'line3d') {
    options.plugins = {
      ...options.plugins,
      legend: {
        ...options.plugins?.legend,
        display: true,
        position: 'top',
        labels: {
          ...options.plugins?.legend?.labels,
          usePointStyle: true,
          pointStyle: 'line',
          padding: 20,
          color: '#e3e3e3',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4f8cff',
        borderWidth: 2,
        cornerRadius: 8
      }
    };
    options.scales = {
      ...options.scales,
      x: {
        ...options.scales?.x,
        grid: {
          display: true,
          color: 'rgba(255,255,255,0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#e3e3e3',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y: {
        ...options.scales?.y,
        grid: {
          display: true,
          color: 'rgba(255,255,255,0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#e3e3e3',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    };
  } else if (type === 'pie3d') {
    options.plugins = {
      ...options.plugins,
      legend: {
        ...options.plugins?.legend,
        display: true,
        position: 'right',
        labels: {
          ...options.plugins?.legend?.labels,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: '#e3e3e3',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4f8cff',
        borderWidth: 2,
        cornerRadius: 8
      }
    };
  }
  
  return options;
};

const ChartRenderer = ({ type = 'bar', data, options }) => {
  const chartRef = useRef(null);
  
  // Force chart re-render when type changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  }, [type]);

  let chartData = data;
  let chartOptions = options;
  let ChartComponent;
  
  // Handle 3D charts
  if (type.includes('3d')) {
    chartData = create3DEffect(data, type);
    chartOptions = get3DOptions(options, type);
    
    if (type === 'bar3d') {
      ChartComponent = Bar;
    } else if (type === 'line3d') {
      ChartComponent = Line;
    } else if (type === 'pie3d') {
      ChartComponent = Pie;
    }
  } else if (type === 'area') {
    chartData = createAreaData(data);
    ChartComponent = Line;
  } else {
    ChartComponent = chartMap[type] || Bar;
  }

  // Ensure responsive options are properly set
  const finalOptions = {
    ...chartOptions,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index',
    }
  };
  
  return (
    <ChartComponent 
      ref={chartRef}
      data={chartData} 
      options={finalOptions}
      key={`${type}-${JSON.stringify(data)}`}
    />
  );
};

export default ChartRenderer;
