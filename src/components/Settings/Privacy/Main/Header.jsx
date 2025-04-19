import React from 'react';
import { ChevronLeft } from 'lucide-react';

const Header = ({ goBack }) => (
  <>
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1030,
        height: '50px',
        backgroundColor: '#212529', // Bootstrap dark background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 1rem',
        borderBottom: '1px solid #444',
      }}
    >
      <ChevronLeft
        size={24}
        role="button"
        onClick={goBack}
        style={{
          color: 'white',
          cursor: 'pointer',
          marginRight: '1rem',
        }}
      />
      <h2
        style={{
          marginBottom: 0,
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        Privacy
      </h2>
    </div>
    {/* Spacer to prevent content from being hidden behind fixed header */}
    <div style={{ height: '50px' }} />
  </>
);

export default Header;
