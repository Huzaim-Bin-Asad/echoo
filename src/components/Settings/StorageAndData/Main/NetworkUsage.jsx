import React from 'react';
import { RefreshCcwDot } from 'lucide-react';
import { Form } from 'react-bootstrap';

const NetworkUsage = () => (
  <div
    className="pt-4 border-top border-secondary"
    style={{ marginTop: '15px' }}
  >
    <div
      className="d-flex align-items-start justify-content-start mb-4"
      style={{ marginLeft: '20px' }}
    >
      <div style={{ marginRight: '15px', marginLeft: '-5px', marginTop: '2px' }}>
        <RefreshCcwDot size={26} color="white" />
      </div>
      <div>
        <p className="mb-1 fs-6">Network usage</p>
        <small className="text-secondary">376.4 MB sent · 71.8 MB received</small>
      </div>
    </div>

    <div
      className="d-flex align-items-center justify-content-between mb-4"
      style={{ marginLeft: '56px', marginRight: '20px' }}
    >
      <p className="mb-1">Use less data for calls</p>
      <Form.Check type="switch" id="dataToggle" style={{ fontSize: "1.4rem" }} />
    </div>

    <div
      className="d-flex align-items-center justify-content-between"
      style={{ marginLeft: '56px', marginRight: '10px' }}
    >
      <div>
        <p className="mb-1">Proxy</p>
        <small className="text-secondary mt-1 mb-2 d-block">Off</small>
      </div>
    </div>
  </div>
);

export default NetworkUsage;
