import React, { useRef } from 'react';
import { User, Plus } from 'lucide-react';
import { useUser } from '../../services/UserContext';
import useDevicePermissions from '../../hooks/useDevicePermissions';

const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const AddStatus = ({ onFileSelected }) => {
  const { user } = useUser();
  const profileImageUrl = user?.user?.profile_picture;
  const fileInputRef = useRef(null);
  const { permissionStatus, requestMultiplePermissions } = useDevicePermissions();

  const checkPermissionsAndOpenPicker = async () => {
    console.log('checkPermissionsAndOpenPicker called');
    try {
      const camStatus = permissionStatus.camera;
      const micStatus = permissionStatus.microphone;
      console.log('Camera status:', camStatus, 'Microphone status:', micStatus);

      if (camStatus !== 'granted' || micStatus !== 'granted') {
        console.log('Requesting permissions...');
        const result = await requestMultiplePermissions(['camera', 'microphone']);
        console.log('Permission request result:', result);
        if (result.camera !== 'granted' || result.microphone !== 'granted') {
          console.warn('Permissions denied, proceeding anyway');
        }
      }

      if (isMobileDevice()) {
        console.log('Mobile: Triggering file input');
        fileInputRef.current.click();
      }
    } catch (error) {
      console.error('Permission error:', error);
      if (isMobileDevice()) {
        console.log('Mobile: Triggering file input as fallback');
        fileInputRef.current.click();
      }
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0]; // Take the first file
    if (file && onFileSelected) {
      console.log('Selected file:', file);
      const url = URL.createObjectURL(file);
      onFileSelected(url, file.type);
    }
  };

  return (
    <div className="px-3 pt-3">
      <h5 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Status</h5>

      <div
        className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm"
        style={{
          border: '1px solid rgba(0,0,0,0.05)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          zIndex: 10,
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
        onClick={checkPermissionsAndOpenPicker}
        onTouchStart={checkPermissionsAndOpenPicker}
      >
        <div className="position-relative">
          <div
            className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center bg-light"
            style={{ width: 56, height: 56 }}
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="My Status"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #6c757d, #495057)',
                }}
              >
                <User color="white" size={28} />
              </div>
            )}
          </div>
          <div
            className="position-absolute bg-primary rounded-circle d-flex justify-content-center align-items-center shadow-sm"
            style={{
              width: 22,
              height: 22,
              bottom: 0,
              right: 0,
              border: '2px solid white',
            }}
          >
            <Plus color="white" size={14} />
          </div>
        </div>

        <div className="ms-3">
          <strong style={{ fontSize: '0.95rem' }}>My Status</strong>
          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
            Tap to add status update
          </p>
        </div>
      </div>

      <input
        type="file"
        accept="image/*,video/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default AddStatus;