import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DotMenu = () => {
  return (
    <div
      className="dropdown-menu show shadow"
      style={{
        minWidth: '200px',
        maxHeight: '52vh',        // Adjusts height based on viewport
        overflowY: 'auto',        // Scroll if content overflows
        position: 'absolute',
        top: '60px',
        right: '5px',
        borderRadius: '10px',
        padding: '0px 0',
        zIndex: 1000,
      }}
    >
      <button className="dropdown-item py-3 px-4" style={{ fontSize: '1.05rem' }}>New group</button>
      <div className="dropdown-divider my-1"></div>
      <button className="dropdown-item py-3 px-4" style={{ fontSize: '1.05rem' }}>New Community</button>
      <div className="dropdown-divider my-1"></div>
      <button className="dropdown-item py-3 px-4" style={{ fontSize: '1.05rem' }}>Linked devices</button>
      <div className="dropdown-divider my-1"></div>
      <button className="dropdown-item py-3 px-4" style={{ fontSize: '1.05rem' }}>Starred messages</button>
      <div className="dropdown-divider my-1"></div>
      <button className="dropdown-item py-3 px-4" style={{ fontSize: '1.05rem' }}>Settings</button>
    </div>
  );
};

export default DotMenu;
