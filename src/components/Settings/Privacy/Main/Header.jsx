import React from 'react';
import { ChevronLeft } from 'lucide-react'; // Import Lucide icon

const Header = ({ goBack }) => (
  <div className="d-flex align-items-center mb-4">
    <ChevronLeft 
      className="me-3" 
      size={24} 
      role="button" 
      onClick={goBack} 
    />
    <h4 className="mb-0">Privacy</h4>
  </div>
);

export default Header;
