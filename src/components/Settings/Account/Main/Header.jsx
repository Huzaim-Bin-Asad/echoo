import React from 'react';
import { ChevronLeft } from 'lucide-react'; // Import ChevronLeft from Lucide React

const Header = ({ title, onBack, style }) => {
  return (
    <div 
      className="d-flex flex-column" 
      style={{
        ...style?.container, 
        marginBottom: '0', // Removed margin-bottom
        padding: '0', // Removed padding
      }}
    >
      <div className="d-flex align-items-center" style={style?.header}>
        <ChevronLeft 
          className="me-3" 
          size={20} 
          role="button" 
          onClick={onBack} 
          style={style?.icon} // Icon custom style
        />
        <h4 className="mb-0" style={style?.title}>{title}</h4> {/* Title custom style */}
      </div>
      
      {/* Separation Line */}
      <hr className="border-t border-gray-300" style={style?.line} /> {/* Line custom style */}
    </div>
  );
};

export default Header;
