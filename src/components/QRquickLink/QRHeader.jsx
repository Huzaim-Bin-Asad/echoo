import React, { useState } from 'react';
import { ChevronLeft, EllipsisVertical } from 'lucide-react';
import QRDropdown from './QRDropdown';
import QRResetModal from './QRResetModal';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const QRHeader = ({ showDotIcon }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleDotClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleResetLink = () => {
    setDropdownVisible(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const generateNewLink = () => {
    console.log('New QR Code and Short Link generated');
    closeModal();
    // Add your QR generation logic here
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2 position-relative">
      <div className="d-flex align-items-center" onClick={handleBack} style={{ cursor: 'pointer' }}>
        <ChevronLeft />
        <h4 className="mb-0 ms-2">Short link QR</h4>
      </div>

      {showDotIcon && (
        <div className="position-relative">
          <EllipsisVertical onClick={handleDotClick} />
          {isDropdownVisible && <QRDropdown onResetLink={handleResetLink} />}
        </div>
      )}

      {isModalVisible && <QRResetModal onClose={closeModal} onGenerateNew={generateNewLink} />}
    </div>
  );
};

export default QRHeader;
