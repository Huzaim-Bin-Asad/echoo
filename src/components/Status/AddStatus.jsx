// components/Status/AddStatus.jsx
import React from 'react';
import { User, Plus } from 'lucide-react';

const AddStatus = () => (
  <>
    <h5 className="fw-bold px-3 pt-3 mb-2">Status</h5>
    <div className="d-flex align-items-center px-3 py-2 bg-white border-bottom">
      <div className="position-relative">
        <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center" style={{ width: 50, height: 50 }}>
          <User color="white" size={24} />
        </div>
        <div
          className="position-absolute bg-primary rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: 20, height: 20, bottom: 0, right: 0 }}
        >
          <Plus color="white" size={14} />
        </div>
      </div>
      <div className="ms-3">
        <strong>My Status</strong>
        <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>Tap to add status update</p>
      </div>
    </div>
  </>
);

export default AddStatus;
