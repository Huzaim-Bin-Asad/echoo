// components/QRquickLink/QRInfo.jsx
import React from 'react';

const QRInfo = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-bottom mb-3">
      <div className="d-flex">
        <button
          className={`flex-fill text-center py-2 border-0 bg-transparent ${
            activeTab === 'myCode' ? 'text-primary border-bottom border-primary fw-semibold' : 'text-muted'
          }`}
          onClick={() => onTabChange('myCode')}
        >
          My code
        </button>
        <button
          className={`flex-fill text-center py-2 border-0 bg-transparent ${
            activeTab === 'scanCode' ? 'text-primary border-bottom border-primary fw-semibold' : 'text-muted'
          }`}
          onClick={() => onTabChange('scanCode')}
        >
          Scan code
        </button>
      </div>
    </div>
  );
};

export default QRInfo;
