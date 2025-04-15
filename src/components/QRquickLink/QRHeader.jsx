// components/QRquickLink/QRHeader.jsx
import React from 'react';
import { ChevronLeft, EllipsisVertical } from 'lucide-react';

const QRHeader = () => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
      <div className="d-flex align-items-center">
        <ChevronLeft />
        <h4 className="mb-0 ms-2">Short link QR</h4> {/* ms-2 adds left margin */}
      </div>
      <EllipsisVertical />
    </div>
  );
};

export default QRHeader;
