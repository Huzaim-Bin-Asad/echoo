import React from 'react';

const ManageStorage = () => (
  <div className="d-flex align-items-start justify-content-start mt-1 mb-2" style={{ marginLeft: '20px' }}>
    <div style={{ marginRight: '15px', marginLeft: '-10px', marginTop: '2px' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="white" viewBox="0 0 256 256">
        <path d="M178.34,165.66,160,147.31V208a8,8,0,0,1-16,0V147.31l-18.34,18.35a8,8,0,0,1-11.32-11.32l32-32a8,8,0,0,1,11.32,0l32,32a8,8,0,0,1-11.32,11.32ZM160,40A88.08,88.08,0,0,0,81.29,88.68,64,64,0,1,0,72,216h40a8,8,0,0,0,0-16H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.12A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,100.8,66,8,8,0,0,0,3.2,15.34,7.9,7.9,0,0,0,3.2-.68A88,88,0,0,0,160,40Z"></path>
      </svg>
    </div>
    <div>
      <p className="mb-1 fs-6">Manage storage</p>
      <small className="text-secondary">8.1 GB</small>
    </div>
  </div>
);

export default ManageStorage;
