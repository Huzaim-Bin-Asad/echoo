import React, { useRef, useEffect, useState } from 'react';
import { User, Plus } from 'lucide-react';
import { useUser } from '../../services/UserContext';
import useDevicePermissions from '../../hooks/useDevicePermissions';
import {
  startCurrentStatusFetcher,
  stopCurrentStatusFetcher
} from './MyStatusView/currentStatusFetcher';

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const AddStatus = ({ onFileSelected, onShowMyStatusView }) => {
  const { user } = useUser();
  const profileImageUrl = user?.user?.profile_picture;
  const fileInputRef = useRef(null);
  const { permissionStatus, requestMultiplePermissions } = useDevicePermissions();
  const [preview, setPreview] = useState(null);
  const [lastUploadedTime, setLastUploadedTime] = useState(null);

  useEffect(() => {
    startCurrentStatusFetcher((data) => {
      setPreview(data);
      if (data?.timestamp) {
        setLastUploadedTime(data.timestamp);
      }
    });
    return () => stopCurrentStatusFetcher();
  }, []);

  const openFilePicker = async () => {
    try {
      const { camera, microphone } = permissionStatus;
      if (camera !== 'granted' || microphone !== 'granted') {
        const result = await requestMultiplePermissions(['camera', 'microphone']);
        if (result.camera !== 'granted' || result.microphone !== 'granted') {
          console.warn('Permissions denied, proceeding anyway');
        }
      }
      if (isMobileDevice()) fileInputRef.current.click();
    } catch (err) {
      console.error('Permission error:', err);
      if (isMobileDevice()) fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelected) {
      const url = URL.createObjectURL(file);
      onFileSelected(url, file.type);
    }
  };

  const handleClick = () => {
    if (preview && onShowMyStatusView) {
      onShowMyStatusView(true);
    } else {
      openFilePicker();
    }
  };

  const thumbnail = preview?.thumbnail;
  const showGradient = !!thumbnail;
  const showPlusIcon = !thumbnail;

  return (
    <div className="px-3 pt-3">
      <h5 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Status</h5>
      <div
        className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm"
        style={{
          border: '1px solid rgba(0,0,0,0.05)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
        onClick={handleClick}
        onTouchStart={handleClick}
      >
        <div className="position-relative">
          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              padding: showGradient ? 2 : 0,
              background: showGradient ? 'linear-gradient(45deg, #8e5db1 , #9b6ea9)' : 'transparent'
            }}
          >
            <div
              className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center bg-light"
              style={{ width: 56, height: 56 }}
            >
              {thumbnail ? (
                <img src={thumbnail} alt="Status" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User color="white" size={28} />
              )}
            </div>
          </div>
          {showPlusIcon && (
            <div
              className="position-absolute bg-primary rounded-circle d-flex justify-content-center align-items-center shadow-sm"
              style={{
                width: 20,
                height: 20,
                bottom: 0,
                right: 0,
                border: '1.5px solid white'
              }}
            >
              <Plus color="white" size={12} />
            </div>
          )}
        </div>

        <div className="ms-3">
          <strong style={{ fontSize: '0.95rem' }}>My Status</strong>
          {lastUploadedTime ? (
            <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
              {new Date(lastUploadedTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          ) : (
            <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
              Tap to add status update
            </p>
          )}
        </div>
      </div>

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
};

export default AddStatus;