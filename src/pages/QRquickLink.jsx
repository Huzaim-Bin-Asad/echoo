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

  console.log('[QRquickLink] Rendered with activeTab:', activeTab);

  // Logs for flash state changes
  useEffect(() => {
    console.log('[QRquickLink] Flash toggled:', flashOn);
  }, [flashOn]);

  // Logs when component mounts/unmounts
  useEffect(() => {
    console.log('[QRquickLink] Component mounted.');
    return () => {
      console.log('[QRquickLink] Component unmounted.');
    };
  }, []);

  // Open gallery placeholder
  const openGallery = () => {
    console.log('[QRquickLink] Gallery button clicked.');
    alert('Gallery or file section would open here');
  };

  // ✅ Enhanced tab change handler that receives both tab and optional stream
const handleTabChange = ({ tab /*, stream removed*/ }) => {
  console.log('[QRquickLink] handleTabChange called with:', { tab });

  setActiveTab(tab);

  if (tab === 'scanCode') {
    console.log('[QRquickLink] Switching to scanCode tab.');
    // Don't try to start camera with a stream anymore
    if (scanRef.current) {
      // Optionally, you can still start camera, but without a stream passed from outside
      // Or just leave this empty if you want no camera start here
      console.log('[QRquickLink] scanRef is ready but no external stream provided.');
    }
  } else {
    console.log('[QRquickLink] Switching to myCode tab. Stopping camera.');
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
          {console.log('[QRquickLink] Rendering QRCard (myCode view).')}
          <QRCard />
        </>
      ) : (
        <>
          {console.log('[QRquickLink] Rendering QRScan (scanCode view).')}
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
