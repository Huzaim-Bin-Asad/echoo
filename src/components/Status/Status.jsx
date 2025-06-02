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
import StatusView from "./MainStatusView/MainStatusView";
import AllContacts from "./ContactsAllowed/ContactsAllowed";
import ContactsNotAllowed from "./ContactsNotAllowed/index";
import ContactListCache from "./ContactsNotAllowed/contactListCache";
import RecentlyContactListCache from "./ContactsAllowed/recentlyContactedCache";

import {
  startPollingStatuses,
  stopPollingStatuses,
} from "./MyStatusView/fetchAllStatuses";

const CACHE_KEY = "contactsStatusCache";

const Status = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);
  const [showArchiveSettings, setShowArchiveSettings] = useState(false);
  const [showContactsAllowed, setShowContactsAllowed] = useState(false);
  const [showContactsNotAllowed, setShowContactsNotAllowed] = useState(false);

  const [excludedContacts, setExcludedContacts] = useState([]); // ✅ for "My contacts except..."
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMyStatusView, setShowMyStatusView] = useState(false);
  const [showStatusView, setShowStatusView] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [userId, setUserId] = useState(null);
  const [statusIds, setStatusIds] = useState([]);
  const [fromMyStatusView, setFromMyStatusView] = useState(false);

  const togglePopup = () => setShowPopup((prev) => !prev);

  const handleArchiveSettingsClick = () => setShowArchiveSettings(true);

  const handleBackClick = () => {
    setShowPrivacyPage(false);
    setShowArchiveSettings(false);
    setShowContactsAllowed(false);
    setShowContactsNotAllowed(false);
  };

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
    const initialStatuses = loadCachedStatuses();
    setStatuses(initialStatuses);

    const unsubscribe = startPollingStatuses((updatedStatuses) => {
      try {
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

  // ✅ Route: Contacts Not Allowed
  if (showContactsNotAllowed) {
    console.log("🔔 Navigating to ContactsNotAllowed with excludedContacts:", excludedContacts);
    if (excludedContacts.length === 0) {
      console.log("⚠️ 0 contacts are currently excluded.");
    }
    return (
      <ContactsNotAllowed
        handleBackClick={handleBackClick}
        excludedContacts={excludedContacts}
      />
    );
  }

  // ✅ Route: Contacts Allowed
  if (showContactsAllowed) {
    return <AllContacts handleBackClick={handleBackClick} />;
  }

  // ✅ Route: Status Privacy
  if (showPrivacyPage) {
    return (
      <StatusPrivacy
        handleBackClick={handleBackClick}
        onOnlyShareWithClick={() => {
          console.log("✅ Triggered ContactsAllowed screen");
          setShowContactsAllowed(true);
        }}
        onContactsExceptClick={() => {
          // 🔽 Simulate fetching excluded contacts from storage or context
          const stored = localStorage.getItem("excludedContacts");
          const excluded = stored ? JSON.parse(stored) : [];
          console.log("✅ Triggered ContactsNotAllowed screen with", excluded.length, "excluded");

          setExcludedContacts(excluded); // <- store for use in route
          setShowContactsNotAllowed(true);
        }}
      />
    );
  }

  // ✅ Route: Status View
  if (showStatusView) {
    return (
      <StatusView
        userId={userId}
        blobUrl={currentStatus?.blobUrl || ""}
        contactName={currentStatus?.contactName}
        statuses={currentStatus?.statuses}
        latestStatus={currentStatus?.latestStatus}
        mediaItems={currentStatus?.mediaItems}
        statusIds={currentStatus?.statusIds}
        statusId={currentStatus?.statusId}
        onBack={() => {
          setShowStatusView(false);
          setCurrentStatus(null);
          setUserId(null);
          setStatusIds([]);
          setFromMyStatusView(false);
        }}
      />
    );
  }


  // ✅ Route: My Status View
  if (showMyStatusView) {
    return (
      <MyStatusView
        statuses={statuses}
        loading={loadingStatuses}
        onBack={() => {
          setShowMyStatusView(false);
          setCurrentStatus(null);
        }}
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
        onStatusSelect={(blobUrl, userId, duration, statusId) => {
          const payloadFromMyStatusView = {
            blobUrl,
            userId,
            duration,
            statusId,
            contactName: "Me",
            statuses: [],
            latestStatus: null,
            mediaItems: [],
            statusIds: statusId ? [statusId] : [],
          };

          setCurrentStatus(payloadFromMyStatusView);
          setUserId(userId);
          setFromMyStatusView(true);
          setShowMyStatusView(false);
          setShowStatusView(true);
        }}
      />
    );
  }

  // ✅ Default Status Home View
  return (
    <div className="bg-light vh-100 d-flex flex-column position-relative">
          <ContactListCache />
          <RecentlyContactListCache/>
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
                  setShowPrivacyPage(true);
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

            <RecentUpdates
              onStatusClick={(statusData) => {
                setCurrentStatus(statusData);
                setUserId(statusData.userId);
                setStatusIds(statusData.statusIds || []);
                setFromMyStatusView(false);
                setShowStatusView(true);
              }}
            />
          </div>

          <BottomNav />
        </>
      )}
    </div>
  );
};

export default Status;
