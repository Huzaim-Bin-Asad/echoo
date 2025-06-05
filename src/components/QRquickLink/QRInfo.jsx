import React from 'react';
import { toast } from 'react-toastify';
import useDevicePermissions from '../../hooks/useDevicePermissions';

const QRInfo = ({ activeTab, onTabChange }) => {
  const { permissionStatus, requestMultiplePermissions } = useDevicePermissions();

  const handleTabClick = async (tab) => {
    console.log(`[QRInfo] Tab clicked: ${tab}`);

    if (tab === 'scanCode') {
      console.log('[QRInfo] Checking camera permission...');
      
      if (permissionStatus.camera !== 'granted') {
        toast.info('Camera permission required to scan QR code.');

        try {
          const result = await requestMultiplePermissions(['camera']);
          console.log('[QRInfo] Permission request result:', result);

          if (result.camera !== 'granted') {
            toast.error('Camera access denied. Please enable it to scan QR codes.');
            return;
          } else {
            toast.success('Camera permission granted!');
          }
        } catch (err) {
          console.error('[QRInfo] Error while requesting camera permission:', err);
          toast.error('Failed to request camera permission.');
          return;
        }
      } else {
        console.log('[QRInfo] Camera permission already granted.');
        toast.success('Camera already authorized!');
      }

      onTabChange({ tab });

    } else {
      console.log('[QRInfo] Switching to tab:', tab);
      onTabChange({ tab });
    }
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
