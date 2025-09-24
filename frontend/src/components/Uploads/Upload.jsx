import React, { useRef, useState, useContext, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './Uploads.css';
import { UploadContext } from './UploadContext';
import { uploadFile, fetchUploads } from '../../api';

const Uploads = ({ bgImage, onUploadSuccess }) => {
  const [fileName, setFileName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const fileInputRef = useRef(null);
  const { setUploadedData } = useContext(UploadContext);
  const [chartType, setChartType] = useState('Bar');

  useEffect(() => {
    async function fetchFiles() {
      setLoadingFiles(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetchUploads(token);
        setUploadedFiles(res.data || []);
      } catch (err) {
        setUploadedFiles([]);
      }
      setLoadingFiles(false);
    }
    fetchFiles();
  }, []);

  const filterRows = (rows) =>
    rows.filter(row => Array.isArray(row) && row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== ''));

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (json.length > 0) {
        const filteredRows = filterRows(json.slice(1));
        setHeaders(json[0]);
        setRows(filteredRows);
        setUploadedData({ headers: json[0], rows: filteredRows });
      } else {
        setHeaders([]);
        setRows([]);
        setUploadedData(null);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFilePreview = async (fileId) => {
    setShowPreview(false);
    setHeaders([]);
    setRows([]);
    setFileName('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/uploads/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const blob = await res.blob();
      const file = new File([blob], 'preview.xlsx');
      setFileName(file.name);
      setShowPreview(true);
      parseExcel(file);
    } catch (err) {
      alert('Failed to load file preview.');
    }
  };

  const handleBackendUpload = async (file) => {
    let labels = [];
    let data = [];
    if (headers.length > 1 && rows.length > 0) {
      labels = rows.map(row => row[0]);
      data = rows.map(row => Number(row[1]));
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chartType', chartType);
    formData.append('labels', JSON.stringify(labels));
    formData.append('data', JSON.stringify(data));
    try {
      const token = localStorage.getItem('token');
      await uploadFile(formData, token);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      // Handle error
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
      setFileName(file.name);
      parseExcel(file);
      setShowPreview(true);
      handleBackendUpload(file);
    } else {
      alert('Please upload a valid Excel file (.xls or .xlsx)');
      setFileName('');
      setShowPreview(false);
      setHeaders([]);
      setRows([]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
      setFileName(file.name);
      parseExcel(file);
      setShowPreview(true);
      handleBackendUpload(file);
    } else {
      alert('Please upload a valid Excel file (.xls or .xlsx)');
      setFileName('');
      setShowPreview(false);
      setHeaders([]);
      setRows([]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-center" style={bgImage ? {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      minHeight: '100vh',
      boxShadow: '0 8px 32px 8px rgba(0,0,0,0.55)'
    } : {}}>
      <div className="upload-card">
        <h2>Upload Excel Files</h2>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="chart-type-select" style={{ marginRight: 8 }}>Chart Type:</label>
          <select id="chart-type-select" value={chartType} onChange={e => setChartType(e.target.value)} className="chart-type-dropdown">
            <option value="Bar">Bar</option>
            <option value="Line">Line</option>
            <option value="Pie">Pie</option>
          </select>
        </div>

        {!showPreview && (
          <div
            className="input-div fade-in"
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              className="input"
              name="file"
              type="file"
              accept=".xls,.xlsx"
              ref={fileInputRef}
              onChange={handleFileChange}
              onClick={e => e.stopPropagation()}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor" className="icon"><polyline points="16 16 12 12 8 16"></polyline><line y2="21" x2="12" y1="12" x1="12"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
          </div>
        )}

        {fileName && <p className="file-name">Selected file: {fileName}</p>}

        {showPreview && headers.length > 0 && rows.length > 0 && (
          <div className="excel-preview fade-in">
            <h3>Preview</h3>
            <table>
              <thead>
                <tr>
                  {headers.map((header, idx) => (
                    <th key={idx}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    {headers.map((_, colIdx) => (
                      <td key={colIdx}>{row[colIdx]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showPreview && (headers.length === 0 || rows.length === 0) && (
          <div className="excel-preview"><p>No usable data found in the uploaded file.</p></div>
        )}

        {loadingFiles && <div>Loading files...</div>}
      </div>
    </div>
  );
};

export default Uploads;
