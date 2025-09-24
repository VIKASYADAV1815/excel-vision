import React, { createContext, useState } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadedData, setUploadedData] = useState(null); // { headers: [], rows: [] }
  return (
    <UploadContext.Provider value={{ uploadedData, setUploadedData }}>
      {children}
    </UploadContext.Provider>
  );
}; 