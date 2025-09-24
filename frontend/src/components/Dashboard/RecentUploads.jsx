import React from 'react';
import './RecentUploads.css';
import Spinner from './Spinner';

const RecentUploads = ({ uploads = [], loading }) => {
  if (loading) {
    return <div className="recent-uploads-glass"><Spinner /></div>;
  }

  if (!uploads.length) {
    return <div className="recent-uploads-glass"><h3>Recent Uploads</h3><div className="empty-state">No uploads yet! Start by uploading your first file.</div></div>;
  }

  return (
    <div className="recent-uploads-glass">
      <h3>Recent Uploads</h3>
      <ul className="uploads-list">
        {uploads.map((file, idx) => (
          <li key={idx} className="upload-item">
            <span className="upload-filename">{file.filename}</span>
            <span className="upload-date">{file.date}</span>
            <a href={file.url} className="upload-action" download>
              View
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUploads; 