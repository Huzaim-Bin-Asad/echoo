// pages/QRquickLink.jsx
import React, { useEffect, useState } from 'react';
import QRHeader from '../components/QRquickLink/QRHeader';
import QRInfo from '../components/QRquickLink/QRInfo';
import QRCard from '../components/QRquickLink/QRCard';
import QRScan from '../components/QRquickLink/QRScan';
import 'bootstrap/dist/css/bootstrap.min.css';
import QRCode from 'qrcode';

const QRquickLink = () => {
  const [activeTab, setActiveTab] = useState('myCode');
  const [qrImage, setQrImage] = useState('');
  const [name] = useState('Humna');

  useEffect(() => {
    const generateQRCode = async () => {
      const randomLink = `https://example.com/${Math.random().toString(36).substring(7)}`;
      try {
        const url = await QRCode.toDataURL(randomLink);
        setQrImage(url);
      } catch (err) {
        console.error(err);
      }
    };

    generateQRCode();
  }, []);

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <QRHeader />
      <QRInfo activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'myCode' ? (
        <QRCard qrImage={qrImage} name={name} />
      ) : (
        <QRScan />
      )}
    </div>
  );
};

export default QRquickLink;
