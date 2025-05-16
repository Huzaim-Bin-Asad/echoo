import React, { useState } from 'react';
import Header from './Header';
import AddStatus from './AddStatus';
import RecentUpdates from './RecentUpdates';
import BottomNav from './BottomNav';
import Popup from './Popup';
import StatusPrivacy from './StatusPrivacy';
import StatusArchiveSettings from './StatusArchiveSettings';
import MediaEditor from './MediaEditor';
import MyStatusView from './MyStatusView/MyStatusView';

const Status = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPrivacyPage] = useState(false);
  const [showArchiveSettings, setShowArchiveSettings] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMyStatusView, setShowMyStatusView] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);

  const togglePopup = () => setShowPopup(prev => !prev);
  const handleArchiveSettingsClick = () => setShowArchiveSettings(true);
  const handleBackClick = () => setShowArchiveSettings(false);

  const handleFileSelected = (fileUrl, fileType) => {
    setSelectedMedia({ fileUrl, fileType });
  };

  const handleCloseMediaEditor = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia.fileUrl);
    }
    setSelectedMedia(null);
  };

  if (showPrivacyPage) {
    return <StatusPrivacy handleBackClick={handleBackClick} />;
  }

  if (showMyStatusView && currentStatus) {
    return (
      <MyStatusView
        statuses={[{
          thumbnailUrl: currentStatus.thumbnail,
          timestamp: new Date(currentStatus.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }]}
        onBack={() => setShowMyStatusView(false)}
        onAddNew={() => {
          setShowMyStatusView(false);
          document.querySelector('input[type="file"]').click();
        }}
      />
    );
  }

  return (
    <div className="bg-light vh-100 d-flex flex-column position-relative">
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
            <AddStatus
              onFileSelected={handleFileSelected}
              onShowMyStatusView={(show) => {
                setShowMyStatusView(show);
                // Simulate fetching current status (ideally pass preview from AddStatus directly)
                setCurrentStatus(JSON.parse(localStorage.getItem('currentStatusPreview') || '{}'));
              }}
            />
            <RecentUpdates />
          </div>

          <BottomNav />
        </>
      )}
    </div>
  );
};

export default Status;
