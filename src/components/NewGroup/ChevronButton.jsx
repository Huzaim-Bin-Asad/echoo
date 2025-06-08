import React from 'react';
import { ChevronRight } from 'lucide-react';

const ChevronButton = ({ onClick, data }) => {
  const handleClick = () => {
    // Clear sessionStorage keys
    sessionStorage.removeItem("disappearingDisplayText");
    sessionStorage.removeItem("groupMetaData");
    sessionStorage.removeItem("groupName");
    sessionStorage.removeItem("groupImage");

    console.log('ChevronButton clicked with data:', data);
    if (onClick) {
      onClick(data); // forward it if needed
    }
  };

  return (
    <div
      className="position-fixed bottom-0 end-0 m-3 d-flex justify-content-center align-items-center"
      style={{
        width: 50,
        height: 50,
        backgroundColor: '#333',
        borderRadius: '12px',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <ChevronRight size={24} color="white" />
    </div>
  );
};

export default ChevronButton;
