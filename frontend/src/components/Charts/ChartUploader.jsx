import React from 'react';

const ChartUploader = ({ files, value, onChange }) => (
  <div className="chart-uploader">
    <label htmlFor="chart-file-select">Select File:</label>
    <select
      id="chart-file-select"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">-- Choose a file --</option>
      {files.map(file => (
        <option key={file.filename} value={file.filename}>
          {file.filename}
        </option>
      ))}
    </select>
  </div>
);

export default ChartUploader;
