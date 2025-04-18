import React from 'react';

const GeneralSettings = () => (
  <div className="mb-4">
    <div className="list-group mb-2">
      <div className="list-group-item bg-dark text-light border-secondary">
        <div className="d-flex justify-content-between align-items-center">
          <span>Read receipts</span>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="readReceiptsSwitch" />
          </div>
        </div>
        <small className="text-muted d-block mt-1">
          If turned off, you won't send or receive read receipts. Read receipts are always sent for group chats.
        </small>
      </div>
    </div>
    <ul className="list-group">
      <li className="list-group-item bg-dark text-light border-secondary">Groups <span className="float-end">My contacts</span></li>
      <li className="list-group-item bg-dark text-light border-secondary">Avatar stickers</li>
    </ul>
  </div>
);

export default GeneralSettings;
