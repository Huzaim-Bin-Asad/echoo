import React, { useEffect, useRef, useState } from 'react';
import QRHeader from '../components/QRquickLink/QRHeader';
import QRInfo from '../components/QRquickLink/QRInfo';
import QRCard from '../components/QRquickLink/QRCard';
import QRScan from '../components/QRquickLink/QRScan';
import 'bootstrap/dist/css/bootstrap.min.css';

const QRquickLink = () => {
  const [activeTab, setActiveTab] = useState('myCode');
  const [flashOn, setFlashOn] = useState(false);
  const scanRef = useRef(null); // Ref for QRScan


  // Logs for flash state changes
  useEffect(() => {
  }, [flashOn]);

  // Logs when component mounts/unmounts
  useEffect(() => {
    return () => {
    };
  }, []);

  // Open gallery placeholder
  const openGallery = () => {
    alert('Gallery or file section would open here');
  };

  // ✅ Enhanced tab change handler that receives both tab and optional stream
const handleTabChange = ({ tab /*, stream removed*/ }) => {

  setActiveTab(tab);

  if (tab === 'scanCode') {
    // Don't try to start camera with a stream anymore
    if (scanRef.current) {
      // Optionally, you can still start camera, but without a stream passed from outside
      // Or just leave this empty if you want no camera start here
    }
  } else {
    if (scanRef.current) {
      scanRef.current.stopCamera();
    }
  }
};

  return (
    <div className="container py-2">
      <QRHeader showDotIcon={activeTab !== 'scanCode'} />
      <QRInfo activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'myCode' ? (
        <>
          <QRCard />
        </>
      ) : (
        <>
          <QRScan
            ref={scanRef}
            flashOn={flashOn}
            setFlashOn={setFlashOn}
            openGallery={openGallery}
          />
        </>
      )}
    </div>
  );
};

export default QRquickLink;
