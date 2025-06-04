// components/QRquickLink/QRCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const QRCard = ({ qrImage, name }) => {
  return (
    <div className="d-flex justify-content-center" style={{ marginTop: '100px' }}>
      <div className="position-relative" style={{ width: '100%', maxWidth: '300px' }}>
        {/* Overlapping Icon */}
        <div
          className="rounded-circle bg-secondary position-absolute start-50 translate-middle"
          style={{
            top: 0,
            transform: 'translate(-50%, -50%)',
            width: 70,
            height: 70,
            zIndex: 2,
            border: '4px solid white',
          }}
        ></div>

        {/* Card lowered */}
        <Card className="text-center shadow rounded pt-2 pb-1 mt-2">
          <Card.Body className="px-3">
            <h6 className="mb-1" style={{ marginTop: '3px' }}>{name}</h6>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0px', marginBottom: '8px' }}>
              Echoo Account
            </p>
            {qrImage ? (
              <img
                src={qrImage}
                alt="QR"
                className="img-fluid"
                style={{ minWidth: 170 }}
              />
            ) : (
              <div className="text-muted" style={{ minHeight: 170 }}>
                QR code not available
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Share button further below */}
        <div className="d-flex justify-content-center mt-5" style={{ marginBottom: '60px' }}>
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={!qrImage}
          >
            Share code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCard;
