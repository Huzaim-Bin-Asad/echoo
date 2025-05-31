import React, { useRef } from 'react';
import MyStatusHeader from './MyStatusHeader';
import MyStatusesList from './MyStatusList';
import { ImagePlus } from 'lucide-react';

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export default function MyStatusView({
  statuses = [],
  onBack,
  onFileSelected,
  permissionStatus,
  requestMultiplePermissions,
  onStatusSelect, // ← Forwarded to parent (e.g., Status.jsx)
}) {
  const fileInputRef = useRef(null);

  const openFilePicker = async () => {
    try {
      const { camera, microphone } = permissionStatus || {};
      if (camera !== 'granted' || microphone !== 'granted') {
        const result = await requestMultiplePermissions(['camera', 'microphone']);
        if (result.camera !== 'granted' || result.microphone !== 'granted') {
          console.warn('Permissions denied, proceeding anyway');
        }
      }
      if (isMobileDevice()) {
        fileInputRef.current?.click();
      }
    } catch (err) {
      console.error('Permission error:', err);
      if (isMobileDevice()) {
        fileInputRef.current?.click();
      }
    }
  };

  const handleAddNew = () => {
    openFilePicker();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelected) {
      const url = URL.createObjectURL(file);
      onFileSelected(url, file.type);
    }
  };

  // <-- Updated to receive all 4 parameters from MyStatusesList and forward them up
  const handleStatusClick = (blobUrl, userId, duration, statusId) => {
    const payloadFromMyStatusView = {
      blobUrl,
      userId,
      duration,
      statusId,
    };

    if (onStatusSelect) {
      onStatusSelect(blobUrl, userId, duration, statusId);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        backgroundColor: '#f3f4f6',
      }}
    >
      <MyStatusHeader onBack={onBack} />

      {/* Status list with click forwarding */}
      <MyStatusesList statuses={statuses} onStatusSelect={handleStatusClick} />

      {/* Add new status button */}
      <button
        onClick={handleAddNew}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 48,
          height: 48,
          backgroundColor: 'white',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        aria-label="Add New Status"
      >
        <ImagePlus color="black" size={24} />
      </button>

      {/* Hidden file input for media upload */}
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
        onChange={handleFileSelect}
      />
    </div>
  );
}
