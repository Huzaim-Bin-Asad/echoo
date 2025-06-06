import React from 'react';

const AdminsCan = () => {
  return (
    <div>
      <h6 className="text-muted mb-3">Admins can:</h6>
      <div className="form-check form-switch d-flex justify-content-between align-items-start">
        <div>
          <label className="form-check-label text-white fw-bold">Approve new members</label>
          <div className="text-muted small">
            When turned on, admins must approve anyone who wants to join the group.
          </div>
        </div>
        <input className="form-check-input" type="checkbox" />
      </div>
    </div>
  );
};

export default AdminsCan;
