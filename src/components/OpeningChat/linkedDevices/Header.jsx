import React from 'react';
import { ChevronLeft } from 'lucide-react';

export const Header = ({ title, goBack }) => (
  <div className="d-flex align-items-center">
    <ChevronLeft
      size={24}
      className="me-3"
      style={{ cursor: 'pointer' }}
      onClick={goBack}
    />
    <h5 className="mb-0">{title}</h5>
  </div>
);
