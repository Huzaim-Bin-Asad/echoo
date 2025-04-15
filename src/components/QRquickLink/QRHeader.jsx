// components/QRquickLink/QRHeader.jsx
import React, { useState } from 'react';
import { ChevronLeft, EllipsisVertical } from 'lucide-react';
import QRDropdown from './QRDropdown'; // Import the QRDropdown component
import QRResetModal from './QRResetModal'; // Import the QRResetModal component

const QRHeader = ({ showDotIcon }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // Toggle the dropdown visibility
  const handleDotClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  // Function to handle the reset link action
  const handleResetLink = () => {
    setDropdownVisible(false); // Hide dropdown after clicking the option
    setModalVisible(true); // Show the modal
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Function to generate a new QR code and short link
  const generateNewLink = () => {
    console.log('New QR Code and Short Link generated');
    closeModal();
    // Call your QR code generation logic here
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2 position-relative">
      <div className="d-flex align-items-center">
        <ChevronLeft />
        <h4 className="mb-0 ms-2">Short link QR</h4> {/* ms-2 adds left margin */}
      </div>
      {showDotIcon && (
        <div className="position-relative">
          <EllipsisVertical onClick={handleDotClick} />
          {isDropdownVisible && <QRDropdown onResetLink={handleResetLink} />}
        </div>
      )}

      {/* Show the modal when it's visible */}
      {isModalVisible && <QRResetModal onClose={closeModal} onGenerateNew={generateNewLink} />}
    </div>
  );
};

export default QRHeader;
