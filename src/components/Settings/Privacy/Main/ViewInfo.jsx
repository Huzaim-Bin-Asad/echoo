import React from 'react';

const ViewInfo = () => (
  <div className="mb-4">
    <p className="text-muted mb-1">Who can see my personal info</p>
    <ul className="list-group">
      <li className="list-group-item bg-dark text-light border-secondary">Last seen and online <span className="float-end">Nobody</span></li>
      <li className="list-group-item bg-dark text-light border-secondary">Profile photo <span className="float-end">Everyone</span></li>
      <li className="list-group-item bg-dark text-light border-secondary">About <span className="float-end">178 contacts excluded</span></li>
      <li className="list-group-item bg-dark text-light border-secondary">Status <span className="float-end">My contacts</span></li>
    </ul>
  </div>
);

export default ViewInfo;
