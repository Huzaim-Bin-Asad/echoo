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

const Status = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPrivacyPage] = useState(false);
  const [showArchiveSettings, setShowArchiveSettings] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMyStatusView, setShowMyStatusView] = useState(false);
  const [setCurrentStatus] = useState(null);
  const [allStatuses, setAllStatuses] = useState([]);  // new state for all statuses
  const [loadingStatuses, setLoadingStatuses] = useState(false);

  const togglePopup = () => setShowPopup(prev => !prev);
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

  // Fetch all statuses for current user when showMyStatusView becomes true
  useEffect(() => {
    if (!showMyStatusView) {
      console.log('[Status] MyStatusView hidden, clearing statuses.');
      setAllStatuses([]);
      return;
    }

    const fetchStatuses = async () => {
      console.log('[Status] Fetching all statuses...');
      setLoadingStatuses(true);

      const rawUser = localStorage.getItem('user');
      if (!rawUser) {
        console.warn('[Status] No user found in localStorage.');
        setLoadingStatuses(false);
        return;
      }

      let user;
      try {
        user = JSON.parse(rawUser);
        console.log('[Status] Parsed user:', user);
      } catch (err) {
        console.error('[Status] Invalid user JSON in localStorage:', err);
        setLoadingStatuses(false);
        return;
      }

      try {
        console.log('[Status] Sending POST request to /api/getAllStatuses with user_id:', user.user_id);
        const res = await fetch('http://localhost:5000/api/getAllStatuses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.user_id }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('[Status] Error response from backend:', data.message);
          throw new Error(data.message);
        }

        console.log(`[Status] Received ${data.statuses.length} statuses.`);

        // Fetch media blobs for each status
        const enrichedStatuses = await Promise.all(
          data.statuses.map(async (status, idx) => {
            console.log(`[Status] Fetching media for status ${status.status_id} (${idx + 1}/${data.statuses.length})`);
            try {
              const mediaRes = await fetch('http://localhost:5000/api/getMediaByUrl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ media_url: status.media_url }),
              });

              if (!mediaRes.ok) {
                console.warn(`[Status] Failed to fetch media for status ${status.status_id}: HTTP ${mediaRes.status}`);
                return status; // fallback without blobUrl
              }

              const blob = await mediaRes.blob();
              const blobUrl = URL.createObjectURL(blob);

              console.log(`[Status] Successfully fetched media for status ${status.status_id}`);
              return { ...status, blobUrl };
            } catch (err) {
              console.error(`[Status] Error fetching media for status ${status.status_id}:`, err);
              return status; // fallback without blobUrl
            }
          })
        );

        console.log('[Status] Setting enriched statuses to state.');
        setAllStatuses(enrichedStatuses);
      } catch (err) {
        console.error('[Status] Error fetching statuses:', err);
      } finally {
        setLoadingStatuses(false);
      }
    };

    fetchStatuses();
  }, [showMyStatusView]);

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
            <div style={{ position: 'absolute', top: '64px', right: '16px', zIndex: 1050 }}>
              <Popup
                showPopup={showPopup}
                togglePopup={togglePopup}
                onPrivacyClick={() => {}}
                onArchiveSettingsClick={handleArchiveSettingsClick}
              />
            </div>
          )}

          {showArchiveSettings && <StatusArchiveSettings handleBackClick={handleBackClick} />}

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
