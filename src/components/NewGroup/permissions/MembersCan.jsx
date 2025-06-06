import React from 'react';

const SwitchOption = ({ label, description }) => {
  return (
    <div className="form-check form-switch d-flex justify-content-between align-items-start mb-4">
      <div>
        <label className="form-check-label text-white fw-bold">{label}</label>
        <div className="text-muted small">{description}</div>
      </div>
      <input className="form-check-input" type="checkbox" defaultChecked />
    </div>
  );
};

const MembersCan = () => {
  return (
    <div className="mb-5">
      <h6 className="text-muted mb-3">Members can:</h6>
      <SwitchOption
        label="Edit group settings"
        description="This includes the name, icon, description, disappearing message timer, and the ability to pin, keep or unkeep messages."
      />
      <SwitchOption
        label="Send messages"
        description=""
      />
      <SwitchOption
        label="Add other members"
        description=""
      />
    </div>
  );
};

export default MembersCan;
