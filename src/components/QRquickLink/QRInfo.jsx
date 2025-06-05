import React from 'react';
import useDevicePermissions from '../../hooks/useDevicePermissions';

const QRInfo = ({ activeTab, onTabChange }) => {
  const { permissionStatus, requestMultiplePermissions } = useDevicePermissions();

  const handleTabClick = async (tab) => {
    if (tab === 'scanCode') {
      // Check if camera permission is granted
      if (permissionStatus.camera !== 'granted') {
        const result = await requestMultiplePermissions(['camera']);
        if (result.camera !== 'granted') {
          console.warn('Camera permission denied');
          // Optionally handle denial (show message, fallback, etc.)
        }
      }
    }

    onTabChange(tab);
  };

  return (
    <div className="border-bottom mb-3">
      <div className="d-flex">
        <button
          className={`flex-fill text-center py-2 border-0 bg-transparent ${
            activeTab === 'myCode' ? 'text-primary border-bottom border-primary fw-semibold' : 'text-muted'
          }`}
          onClick={() => handleTabClick('myCode')}
        >
          My code
        </button>
        <button
          className={`flex-fill text-center py-2 border-0 bg-transparent ${
            activeTab === 'scanCode' ? 'text-primary border-bottom border-primary fw-semibold' : 'text-muted'
          }`}
          onClick={() => handleTabClick('scanCode')}
        >
          Scan code
        </button>
      </div>
    </div>
  );
};

export default QRInfo;
