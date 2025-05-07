import React, { useState } from 'react';
import Header from '../components/Status/Header';
import AddStatus from '../components/Status/AddStatus';
import RecentUpdates from '../components/Status/RecentUpdates';
import BottomNav from '../components/Status/BottomNav';
import Popup from '../components/Status/Popup';
import StatusPrivacy from '../components/Status/StatusPrivacy';
import StatusArchiveSettings from '../components/Status/StatusArchiveSettings';

const StatusPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);
  const [showArchiveSettings, setShowArchiveSettings] = useState(false);

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
    setShowPrivacyPage(false);
    setShowArchiveSettings(false);
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
            onPrivacyClick={handlePrivacyClick}
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

export default StatusPage;