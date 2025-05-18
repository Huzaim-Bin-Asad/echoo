import React, { useEffect, useState } from 'react';
import Header from './Header';
import AddStatus from './AddStatus';
import RecentUpdates from './RecentUpdates';
import BottomNav from './BottomNav';
import Popup from './Popup';
import StatusPrivacy from './StatusPrivacy';
import StatusArchiveSettings from './StatusArchiveSettings';
import MediaEditor from './MediaEditor';
import MyStatusView from './MyStatusView/MyStatusView';

import {
  startPollingStatuses,
  stopPollingStatuses,
  subscribeCacheUpdates,
  getCachedStatuses,
} from './MyStatusView/fetchAllStatuses';

const Status = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPrivacyPage] = useState(false);
  const [showArchiveSettings, setShowArchiveSettings] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMyStatusView, setShowMyStatusView] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [allStatuses, setAllStatuses] = useState(getCachedStatuses() || []);
  const [loadingStatuses, setLoadingStatuses] = useState(false);

  const togglePopup = () => setShowPopup((prev) => !prev);
  const handleArchiveSettingsClick = () => setShowArchiveSettings(true);
  const handleBackClick = () => setShowArchiveSettings(false);

  const handleFileSelected = (fileUrl, fileType) => {
    setShowMyStatusView(false);
    setCurrentStatus(null);
    setSelectedMedia({ fileUrl, fileType });
  };

  const handleCloseMediaEditor = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia.fileUrl);
    }
    setSelectedMedia(null);
  };

  useEffect(() => {
    setLoadingStatuses(true);
    // Start polling statuses every 10 seconds
    startPollingStatuses();

    // Subscribe to cache updates to refresh UI when new data arrives
    const unsubscribe = subscribeCacheUpdates((newCache) => {
      setAllStatuses(newCache || []);
      setLoadingStatuses(false);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      stopPollingStatuses();
    };
  }, []);

  if (showPrivacyPage) {
    return <StatusPrivacy handleBackClick={handleBackClick} />;
  }

  if (showMyStatusView) {
    return (
      <MyStatusView
        statuses={allStatuses}
        loading={loadingStatuses}
        onBack={() => setShowMyStatusView(false)}
        onFileSelected={handleFileSelected}
        requestMultiplePermissions={async () => ({
          camera: 'granted',
          microphone: 'granted',
        })}
        permissionStatus={{
          camera: 'granted',
          microphone: 'granted',
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
            <div
              style={{ position: 'absolute', top: '64px', right: '16px', zIndex: 1050 }}
            >
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
                const preview = JSON.parse(localStorage.getItem('currentStatusPreview') || '{}');
                setCurrentStatus(preview);
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
