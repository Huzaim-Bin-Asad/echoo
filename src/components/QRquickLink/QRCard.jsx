import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const QRCard = () => {
  const [barcodeData, setBarcodeData] = useState(null);

  useEffect(() => {
    const dataString = localStorage.getItem("BarcodeData");
    if (dataString) {
      try {
        const parsed = JSON.parse(dataString);
        setBarcodeData(parsed);
      } catch (err) {
        console.error("Failed to parse BarcodeData:", err);
      }
    }
  }, []);

  if (!barcodeData) return null;

  const { full_name, profile_picture, barcode_url } = barcodeData;

  return (
    <div className="d-flex justify-content-center" style={{ marginTop: '100px' }}>
      <div className="position-relative" style={{ width: '100%', maxWidth: '300px' }}>
        {/* Overlapping Profile Picture */}
        <div
          className="rounded-circle bg-light position-absolute start-50 translate-middle"
          style={{
            top: 0,
            transform: 'translate(-50%, -50%)',
            width: 70,
            height: 70,
            zIndex: 2,
            border: '4px solid white',
            overflow: 'hidden',
          }}
        >
          {profile_picture ? (
            <img
              src={profile_picture}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </div>

        {/* Card with QR code */}
        <Card className="text-center shadow rounded pt-5 pb-1 mt-2">
          <Card.Body className="px-3">
            <h6 className="mb-1">{full_name}</h6>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
              Echoo Account
            </p>
            {barcode_url ? (
              <img
                src={barcode_url}
                alt="QR Code"
                className="img-fluid"
                style={{ maxWidth: 130 }}
              />
            ) : (
              <div className="text-muted" style={{ minHeight: 170 }}>
                QR code not available
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Share button */}
        <div className="d-flex justify-content-center mt-5" style={{ marginBottom: '60px' }}>
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={!barcode_url}
          >
            Share code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCard;
