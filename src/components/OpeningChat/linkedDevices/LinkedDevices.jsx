import React from 'react';
import { Container } from 'react-bootstrap';
import { DeviceItem } from './DeviceItem';
import { Header } from './Header';
import { LinkDeviceCard } from './LinkDeviceCard';
import linkedDevicesImage from '../../../assets/linkedDevices.png';

export default function LinkedDevices({ goBack }) {
    const devices = [
      { name: 'Main', status: 'Logged out', isActive: false },
      { name: 'Windows', status: 'Last active today at 4:17 pm', isActive: true },
    ];
  

  return (
    <Container
    fluid
    className="bg-dark text-white min-vh-120 d-flex flex-column py-3"
    style={{
        maxWidth: "768px",
        margin: "0 auto",
        height: "120vh",
        overflow: "hidden",
      }}  >
  <div className="flex-grow-1 w-100 mx-auto" style={{ maxWidth: '600px' }}>
  {/* Header */}
  <Header title="Linked Devices" goBack={goBack} />

        {/* Divider */}
        <hr className="border-secondary mt-2 mb-3" />

        {/* Image + Button Section */}
        <section className="text-center mb-3">
          <img
            src={linkedDevicesImage}
            alt="Device"
            className="img-fluid mb-2"
            style={{ maxWidth: '280px', height: 'auto', maxHeight: '250px' }}
          />
          <LinkDeviceCard linkedCount={2} maxDevices={4} />
        </section>

        {/* Device List */}
        <section className="mb-3">
          <small className="text-secondary d-block mb-1">Linked Devices</small>
          <p className="fw-semibold fs-6 mb-2">
            Tap a device to edit or remove it
          </p>
          {devices.map((device, idx) => (
            <DeviceItem key={idx} device={device} />
          ))}
        </section>

        {/* Divider */}
        <hr className="border-secondary my-3" />

        {/* Bottom Info Text */}
        <p className="text-white small mb-0 pb-5">
          Devices can access all account messages. Change a name anytime.
        </p>
      </div>
    </Container>
  );
}
