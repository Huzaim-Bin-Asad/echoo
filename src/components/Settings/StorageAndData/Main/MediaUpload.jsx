import React from 'react';

const MediaUpload = () => (
  <div
    className="pt-4 border-top border-secondary"
    style={{ marginTop: '15px' }}
  >
    <div
      className="d-flex align-items-start justify-content-start mb-4"
      style={{ marginLeft: '20px' }}
    >
      <div style={{ marginRight: '15px', marginLeft: '-10px', marginTop: '2px' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="white"
          viewBox="0 0 256 256"
        >
          <path d="M176,72H152a8,8,0,0,0-8,8v96a8,8,0,0,0,8,8h24a56,56,0,0,0,0-112Zm0,96H160V88h16a40,40,0,0,1,0,80Zm-64,8V136H56v40a8,8,0,0,1-16,0V80a8,8,0,0,1,16,0v40h56V80a8,8,0,0,1,16,0v96a8,8,0,0,1-16,0ZM24,48a8,8,0,0,1,8-8H224a8,8,0,0,1,0,16H32A8,8,0,0,1,24,48ZM232,208a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16H224A8,8,0,0,1,232,208Z" />
        </svg>
      </div>
      <div>
        <p className="mb-1 fs-6">Media upload quality</p>
        <small className="text-secondary mt-1 d-block">HD quality</small>
      </div>
    </div>
  </div>
);

export default MediaUpload;
