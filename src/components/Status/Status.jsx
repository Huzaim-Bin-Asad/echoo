import React, { useEffect, useState } from "react";
import Header from "./Header";
import AddStatus from "./AddStatus";
import RecentUpdates from "./RecentUpdates";
import BottomNav from "./BottomNav";
import Popup from "./Popup";
import StatusPrivacy from "./StatusPrivacy";
import StatusArchiveSettings from "./StatusArchiveSettings";
import MediaEditor from "./MediaEditor";
import MyStatusView from "./MyStatusView/MyStatusView";

import {
  startPollingStatuses,
  stopPollingStatuses,
  getCachedStatuses,
} from "./MyStatusView/fetchAllStatuses";

const Status = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPrivacyPage] = useState(false); // Currently not toggled in your code
  const [showArchiveSettings, setShowArchiveSettings] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMyStatusView, setShowMyStatusView] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [allStatuses, setAllStatuses] = useState(
    () => getCachedStatuses() || []
  );
  const [loadingStatuses, setLoadingStatuses] = useState(false);

  const togglePopup = () => setShowPopup((prev) => !prev);
  const handleArchiveSettingsClick = () => setShowArchiveSettings(true);
  const handleBackClick = () => setShowArchiveSettings(false);

  // When a new media file is selected from AddStatus or MyStatusView
  const handleFileSelected = (fileUrl, fileType) => {
    setShowMyStatusView(false);
    setCurrentStatus(null);
    setSelectedMedia({ fileUrl, fileType });
  };

  // Cleanup URL object when MediaEditor is closed
  const handleCloseMediaEditor = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia.fileUrl);
    }
    setSelectedMedia(null);
  };

  // Poll statuses on mount, cache them, and update state
  useEffect(() => {
    setLoadingStatuses(true);

    const unsubscribe = startPollingStatuses((updatedStatuses) => {
      console.log('[Status] Fetched statuses:', updatedStatuses);

      try {
        localStorage.setItem("cachedStatuses", JSON.stringify(updatedStatuses));
      } catch (e) {
        console.warn("Failed to cache statuses locally:", e);
      }

      setAllStatuses(updatedStatuses);
      setLoadingStatuses(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Render Privacy page if active (currently not toggled)
  if (showPrivacyPage) {
    return <StatusPrivacy handleBackClick={handleBackClick} />;
  }

  // Render MyStatusView when toggled on
  if (showMyStatusView) {
    return (
      <MyStatusView
        statuses={allStatuses}
        loading={loadingStatuses}
        onBack={() => setShowMyStatusView(false)}
        onFileSelected={handleFileSelected}
        requestMultiplePermissions={async () => ({
          camera: "granted",
          microphone: "granted",
        })}
        permissionStatus={{
          camera: "granted",
          microphone: "granted",
        }}
        startPollingStatuses={startPollingStatuses}
        stopPollingStatuses={stopPollingStatuses}
        getCachedStatuses={getCachedStatuses}
        currentStatus={currentStatus}
      />
    );
  }

  // Main view: show MediaEditor if media selected, else normal status UI
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
              style={{
                position: "absolute",
                top: "64px",
                right: "16px",
                zIndex: 1050,
              }}
            >
              <Popup
                showPopup={showPopup}
                togglePopup={togglePopup}
                onPrivacyClick={() => {
                  setShowPopup(false);
                  // You can set privacy page toggle here if needed
                }}
                onArchiveSettingsClick={handleArchiveSettingsClick}
              />
            </div>
          )}

          {showArchiveSettings && (
            <StatusArchiveSettings handleBackClick={handleBackClick} />
          )}

          <div
            className="flex-grow-1 overflow-auto"
            style={{ paddingBottom: "85px" }}
          >
            <AddStatus
              onFileSelected={handleFileSelected}
              onShowMyStatusView={(show) => {
                setShowMyStatusView(show);
                // Sync currentStatus from localStorage for preview in MyStatusView
                const preview = JSON.parse(
                  localStorage.getItem("currentStatusPreview") || "null"
                );
                setCurrentStatus(preview);
              }}
            />
            <RecentUpdates statuses={allStatuses} loading={loadingStatuses} />
          </div>

          <BottomNav />
        </>
      )}
    </div>
  );
};

export default Status;
