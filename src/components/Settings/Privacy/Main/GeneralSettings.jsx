import React from 'react';

const GeneralSettings = () => (
  <div className="mb-4">
    <ul className="list-unstyled">
      {/* Groups Item with slightly reduced top margin */}
      <li className="bg-dark text-light mb-4 mt-2">
        <div className="d-flex flex-column">
          <div className="fw-medium fs-6 mt-3">Groups</div>
          <div className="text-secondary small fs-7 mb-3">My contacts</div>
        </div>
      </li>

  

      <li className="bg-dark text-light mb-5">
        <div className="fw-medium fs-6 ">Live location</div>
      </li>

      <li className="bg-dark text-light mb-5">
        <div className="d-flex flex-column">
          <div className="fw-medium fs-6">Calls</div>
          <div className="text-secondary small fs-7">Silence unknown callers</div>
        </div>
      </li>

      <li className="bg-dark text-light mb-5">
        <div className="d-flex flex-column">
          <div className="fw-medium fs-6">Blocked Contacts</div>
          <div className="text-secondary small fs-7">16</div>
        </div>
      </li>

      <li className="bg-dark text-light mb-5">
        <div className="d-flex flex-column">
          <div className="fw-medium fs-6">App Lock</div>
          <div className="text-secondary small fs-7">Disabled</div>
        </div>
      </li>

      <li className="bg-dark text-light mb-5">
        <div className="fw-medium fs-6">Chat Lock</div>
      </li>
    </ul>
  </div>
);

export default GeneralSettings;
