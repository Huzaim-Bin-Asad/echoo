import React from 'react';

const ViewInfo = () => (
  <div className="mb-3 py-2"> {/* Overall bottom margin and padding */}
    <p className="text-white mb-3 fs-6 fw-normal">Who can see my personal info</p>
    <ul className="list-unstyled">
      <li className="mb-3 py-1">
        <div className="text-white fs-6 fw-medium">Last seen and online</div>
        <div className="text-secondary fs-7">Nobody</div>
      </li>
      <li className="mb-3 py-1">
        <div className="text-white fs-6 fw-medium">Profile photo</div>
        <div className="text-secondary fs-7">Everyone</div>
      </li>
      <li className="mb-4 py-2">
        <div className="text-white fs-6 fw-medium">About</div>
        <div className="text-secondary fs-7">178 contacts excluded</div>
      </li>
      <li className="mb-4 py-2">
        <div className="text-white fs-6 fw-medium">Status</div>
        <div className="text-secondary fs-7">My contacts</div>
      </li>
      <li className="py-1 mb-2"> {/* Decreased margin below the Read receipts section */}
        <div className="d-flex justify-content-between align-items-center text-white fs-6 fw-medium">
          <span>Read receipts</span>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="readReceiptsSwitch" />
          </div>
        </div>
        <small className="text-secondary fs-7 d-block mt-1">
          If turned off, you won't send or receive read receipts. Read receipts are always sent for group chats.
        </small>
        <hr className="border-light my-1" /> {/* Reduced margin after Read receipts */}
      </li>
    </ul>
  </div>
);

export default ViewInfo;
