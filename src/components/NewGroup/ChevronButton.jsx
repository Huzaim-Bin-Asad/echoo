import React from 'react';
import { ChevronRight } from 'lucide-react';

const ChevronButton = () => {
  return (
    <div
      className="position-fixed bottom-0 end-0 m-3 d-flex justify-content-center align-items-center"
      style={{
        width: 50,
        height: 50,
        backgroundColor: '#333', // Background color of the square
        borderRadius: '12px',      // Border radius for the square
        cursor: 'pointer',
      }}
    >
      <ChevronRight size={24} color="white" />
    </div>
  );
};

export default ChevronButton;
