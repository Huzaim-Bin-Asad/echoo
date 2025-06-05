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

  // Open gallery placeholder
  const openGallery = () => {
    alert('Gallery or file section would open here');
  };



  // Start camera only when switching to scanCode tab
  useEffect(() => {
    if (activeTab === 'scanCode' && scanRef.current) {
      scanRef.current.startCamera();
    } else if (scanRef.current) {
      scanRef.current.stopCamera();
    }
  }, [activeTab]);

  return (
    <div className="container py-2">
      <QRHeader showDotIcon={activeTab !== 'scanCode'} />
      <QRInfo activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'myCode' ? (
        <QRCard />
      ) : (
        <QRScan ref={scanRef} flashOn={flashOn} setFlashOn={setFlashOn} openGallery={openGallery} />
      )}
    </div>
  );
};

export default QRquickLink;
