// UserBasedPreferences.jsx

import React from 'react';
import { Heart, Ban, ThumbsDown } from 'lucide-react';

const UserBasedPreferences = () => {
  const rowStyle = {
    paddingTop: '15px',
    paddingBottom: '14px',
  };

  const neutralColor = '#6c757d'; // Bootstrap's text-secondary
  const alertRed = '#dc3545';     // Fuller red tone

  return (
    <div
      className="d-flex flex-column bg-white rounded shadow-sm"
      style={{
        padding: "1.1rem",
        width: "calc(100% + 28px)",
        marginLeft: "-15px",
        marginTop: "10px",
      }}
    >
      <div className="d-flex align-items-center" style={{    paddingTop: '6px',paddingBottom: '14px',}}>
        <Heart className="me-3" size={24} style={{ color: neutralColor }} />
        <span className="fs-6" style={{ color: neutralColor }}>Add to favourite</span>
      </div>

      <div className="d-flex align-items-center" style={rowStyle}>
        <Ban className="me-3" size={24} style={{ color: alertRed }} />
        <span className="fs-6" style={{ color: alertRed }}>Block Huzaim</span>
      </div>

      <div className="d-flex align-items-center" style={{ paddingTop: '15px'    }}>
        <ThumbsDown className="me-3" size={24} style={{ color: alertRed }} />
        <span className="fs-6" style={{ color: alertRed }}>Report Huzaim</span>
      </div>
    </div>
  );
};

export default UserBasedPreferences;
