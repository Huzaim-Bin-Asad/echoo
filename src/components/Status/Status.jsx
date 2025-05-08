import React, { useState } from 'react';
import Header from './Header';
import AddStatus from './AddStatus';
import RecentUpdates from './RecentUpdates';
import BottomNav from './BottomNav';
import Popup from './Popup';
import StatusPrivacy from './StatusPrivacy';
import StatusArchiveSettings from './StatusArchiveSettings';
import MediaEditor from './MediaEditor';

const Status = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPrivacyPage] = useState(false);
  const [showArchiveSettings, setShowArchiveSettings] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const togglePopup = () => setShowPopup(prev => !prev);

  const handleArchiveSettingsClick = () => {
    setShowArchiveSettings(true);
  };

  const handleBackClick = () => {
    setShowArchiveSettings(false);
  };

  const handleFileSelected = (fileUrl, fileType) => {
    setSelectedMedia({ fileUrl, fileType });
  };

  const handleCloseMediaEditor = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia.fileUrl); // Clean up URL
    }
    setSelectedMedia(null); // Hide MediaEditor, show original layout
  };

  if (showPrivacyPage) {
    return <StatusPrivacy handleBackClick={handleBackClick} />;
  }

  return (
    <div className="bg-light vh-100 d-flex flex-column position-relative" style={{ backgroundColor: '#f8f9fa' }}>
      {selectedMedia ? (
        <MediaEditor
          fileUrl={selectedMedia.fileUrl}
          fileType={selectedMedia.fileType}
          onClose={handleCloseMediaEditor}
        />
      ) : (
        <>
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
            <AddStatus onFileSelected={handleFileSelected} />
            <RecentUpdates />
          </div>
          <BottomNav />
        </>
      )}
    </div>
  );
};

export default Status;