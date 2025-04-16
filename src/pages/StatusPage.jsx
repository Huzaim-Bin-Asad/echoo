// pages/StatusPage.jsx
import React, { useState } from 'react';
import Header from '../components/Status/Header';
import AddStatus from '../components/Status/AddStatus';
import RecentUpdates from '../components/Status/RecentUpdates';
import BottomNav from '../components/Status/BottomNav';
import Popup from '../components/Status/Popup'; // Ensure this path is correct
import StatusPrivacy from '../components/Status/StatusPrivacy';
import StatusArchiveSettings from '../components/Status/StatusArchiveSettings'; // New component

const StatusPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);
  const [showArchiveSettings, setShowArchiveSettings] = useState(false); // New state

  const togglePopup = () => setShowPopup(prev => !prev);

  const handlePrivacyClick = () => {
    setShowPrivacyPage(true);
    setShowPopup(false);
  };

  const handleArchiveSettingsClick = () => {
    setShowArchiveSettings(true);
    setShowPopup(false);
  };

  const handleBackClick = () => {
    setShowPrivacyPage(false); // Go back to the main page
    setShowArchiveSettings(false); // Hide archive settings
  };

  if (showPrivacyPage) {
    return <StatusPrivacy handleBackClick={handleBackClick} />;
  }

  return (
    <div className="bg-light vh-100 d-flex flex-column position-relative">
      <Header togglePopup={togglePopup} />

      {/* 👇 Popup rendered here globally, but positioned absolutely */}
      {showPopup && (
        <div style={{ position: 'absolute', top: '64px', right: '16px' }}>
          <Popup
            showPopup={showPopup}
            togglePopup={togglePopup}
            onPrivacyClick={handlePrivacyClick}
            onArchiveSettingsClick={handleArchiveSettingsClick} // Pass the new function
          />
        </div>
      )}

      {/* 👇 Status Archive Settings animation */}
      {showArchiveSettings && (
        <StatusArchiveSettings handleBackClick={handleBackClick} />
      )}

      <div className="flex-grow-1 overflow-auto">
        <AddStatus />
        <RecentUpdates />
      </div>
      <BottomNav />
    </div>
  );
};

export default StatusPage;
