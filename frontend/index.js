import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './src/index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
  </React.StrictMode>
);
