import React from 'react';
import { Card } from 'react-bootstrap';
import { SwatchBook, User } from 'lucide-react';

export const DeviceItem = ({ device }) => {
  const Icon = device.status === 'Logged out' ? SwatchBook : User;

  return (
    <Card className="bg-secondary text-white border-0 rounded-4 mb-3">
      <Card.Body className="bg-dark d-flex align-items-center gap-3 p-3">
        <div>
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 45, height: 45 }}
          >
            <Icon size={20} color="#000" />
          </div>
        </div>
        <div>
          <h6 className="mb-1">{device.name}</h6>
          <small className="text-white">{device.status}</small>
        </div>
      </Card.Body>
    </Card>
  );
};
