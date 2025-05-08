import React, { useState } from 'react';
import Header from './Header';
import AddStatus from './AddStatus';
import RecentUpdates from './RecentUpdates';
import BottomNav from './BottomNav';
import Popup from './Popup';
import StatusPrivacy from './StatusPrivacy';
import StatusArchiveSettings from './StatusArchiveSettings';

const Status = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPrivacyPage] = useState(false);
  const [showArchiveSettings, setShowArchiveSettings] = useState(false);

  const togglePopup = () => setShowPopup(prev => !prev);


  const handleArchiveSettingsClick = () => {
    setShowArchiveSettings(true); // This will open the StatusArchiveSettings component
  };

  const handleBackClick = () => {
    setShowArchiveSettings(false); // This will close the StatusArchiveSettings component
  };

  if (showPrivacyPage) {
    return <StatusPrivacy handleBackClick={handleBackClick} />;
  }

  return (
    <div className="bg-light vh-100 d-flex flex-column position-relative" style={{ backgroundColor: '#f8f9fa' }}>
      <Header togglePopup={togglePopup} />

      {showPopup && (
        <div style={{ position: 'absolute', top: '64px', right: '16px', zIndex: 1050 }}>
          <Popup
            showPopup={showPopup}
            togglePopup={togglePopup}
            onPrivacyClick={() => {}}
            onArchiveSettingsClick={handleArchiveSettingsClick}
          />
        </div>
      )}

      {showArchiveSettings && (
        <StatusArchiveSettings handleBackClick={handleBackClick} />
      )}

      <div className="flex-grow-1 overflow-auto" style={{ paddingBottom: '85px' }}>
        <AddStatus />
        <RecentUpdates />
      </div>
      <BottomNav />
    </div>
  );
};

export default Status;
