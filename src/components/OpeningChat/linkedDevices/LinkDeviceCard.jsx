import React from 'react';
import { Button } from 'react-bootstrap';

export const LinkDeviceCard = ({ linkedCount, maxDevices }) => (
  <div className="text-center mb-3">
    <p className="mb-2">{linkedCount} of {maxDevices} devices linked.</p>
    <Button
      variant="light"
      className="rounded-pill px-4 py-2 w-100"
      style={{ maxWidth: '280px' }}
    >
      Link a device
    </Button>
  </div>
);
