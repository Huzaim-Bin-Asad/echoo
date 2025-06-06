import React from 'react';
import { ChevronLeft } from 'lucide-react';

const Header = ({ onBack }) => {
  return (
    <div
      className="d-flex align-items-center mb-4 py-2"
      style={{
        backgroundColor: '#1e1b24',
        borderBottom: '2px solid rgba(255, 255, 255, 0.4)', // thinner and duller line
        color: '#ffffff',
        cursor: 'pointer',
        paddingLeft: 1, // small left padding for breathing room
      }}
    >
      <ChevronLeft
        size={24}
        color="#ffffff"
        onClick={() => onBack?.()}
        style={{ marginRight: 8, marginLeft: 0 }}
      />
      <h5
        className="mb-0"
        style={{
          color: '#f1f1f1',
          fontSize: '1.1rem',
          margin: 0,
          padding: 0,
        }}
      >
        Group permissions
      </h5>
    </div>
  );
};

export default Header;
