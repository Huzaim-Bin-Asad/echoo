import React, { useState } from 'react';
import Status from '../components/Status/Status'; // Importing Status only

const StatusPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup(prev => !prev);

  return (
    <div className="bg-light vh-100 d-flex flex-column position-relative" style={{ backgroundColor: '#f8f9fa' }}>
      <Status
        togglePopup={togglePopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default StatusPage;
