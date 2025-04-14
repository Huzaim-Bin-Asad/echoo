// pages/Echoo.js
import React from 'react';
import OpeningChat from '../components/OpeningChat/OpeningChat';

const Echoo = () => {
  return (
    <div className="bg-white container-fluid p-0" style={{
      maxWidth: '768px',
      margin: '0 auto',
      height: '100vh',
      border: '1px solid #ccc',
      overflow: 'hidden'
    }}>
      <OpeningChat />
    </div>
  );
};

export default Echoo;
