import React from 'react';

const chartTypes = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'doughnut', label: 'Doughnut Chart' },
  { value: 'radar', label: 'Radar Chart' },
  { value: 'polarArea', label: 'Polar Area Chart' },
  { value: 'scatter', label: 'Scatter Plot' },
  { value: 'bubble', label: 'Bubble Chart' },
  { value: 'area', label: 'Area Chart' },
  { value: 'bar3d', label: '3D Bar Chart' },
  { value: 'line3d', label: '3D Line Chart' },
  { value: 'pie3d', label: '3D Pie Chart' },
];

const ChartSelector = ({ value, onChange }) => (
  <div className="chart-selector">
    <label htmlFor="chart-type-select">Chart Type:</label>
    <select
      id="chart-type-select"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {chartTypes.map(type => (
        <option key={type.value} value={type.value}>{type.label}</option>
      ))}
    </select>
  </div>
);

export default ChartSelector;