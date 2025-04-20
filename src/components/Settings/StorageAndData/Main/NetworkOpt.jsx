import React from 'react';

const NetworkOpt = () => (
  <div
    className="pt-4 border-top border-secondary"
    style={{ marginTop: '15px' }}
  >
    <div style={{ marginLeft: '20px', marginRight: '20px' }}>
      <div className="mb-4">
        <div className="text-secondary fw-semibold mb-1">Media auto-download</div>
        <div className="text-secondary">Voice messages are always automatically downloaded</div>
      </div>

      <div className="mb-4" style={{ marginLeft: "35px"}}>
        <p className="mb-1">When using mobile data</p>
        <small className="text-secondary">Photos</small>
      </div>

      <div className="mb-4" style={{ marginLeft: "35px"}}>
        <p className="mb-1">When connected on Wi-Fi</p>
        <small className="text-secondary">All media</small>
      </div>

      <div style={{ marginLeft: "35px"}}>
        <p className="mb-1" >When roaming</p>
        <small className="text-secondary">No media</small>
      </div>
    </div>
  </div>
);

export default NetworkOpt;
