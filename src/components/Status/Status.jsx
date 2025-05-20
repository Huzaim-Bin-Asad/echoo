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
} from "./MyStatusView/fetchAllStatuses";

const CACHE_KEY = "contactsStatusCache";

const Status = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPrivacyPage] = useState(false);
  const [showArchiveSettings, setShowArchiveSettings] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMyStatusView, setShowMyStatusView] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);

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

  // Utility to load cached statuses from localStorage (with try/catch)
  const loadCachedStatuses = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.statuses)) {
          return parsed.statuses;
        }
      }
    } catch (e) {
      console.warn("Failed to parse cached statuses:", e);
    }
    return [];
  };

  useEffect(() => {
    setLoadingStatuses(true);

    // On mount, load cached statuses from localStorage and set
    const initialStatuses = loadCachedStatuses();
    setStatuses(initialStatuses);

    const unsubscribe = startPollingStatuses((updatedStatuses) => {
      console.log("[Status] Fetched statuses:", updatedStatuses);

      try {
        // Save the full object with .statuses array, for consistency
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), statuses: updatedStatuses })
        );
      } catch (e) {
        console.warn("Failed to cache statuses locally:", e);
      }

      setStatuses(updatedStatuses);
      setLoadingStatuses(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Log statuses every time they update
  useEffect(() => {
    console.log("[Status] Passing statuses to RecentUpdates:", statuses);
  }, [statuses]);

  if (showPrivacyPage) {
    return <StatusPrivacy handleBackClick={handleBackClick} />;
  }

  if (showMyStatusView) {
    return (
      <MyStatusView
        statuses={statuses}
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
        currentStatus={currentStatus}
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
                  // Add privacy page toggle here if needed
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
                const preview = JSON.parse(
                  localStorage.getItem("currentStatusPreview") || "null"
                );
                setCurrentStatus(preview);
              }}
            />

            {/* Pass cached statuses and loading state */}
<RecentUpdates />
          </div>

          <BottomNav />
        </>
      )}
    </div>
  );
};

export default Status;
