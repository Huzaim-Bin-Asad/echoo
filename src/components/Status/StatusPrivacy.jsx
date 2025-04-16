import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react'; // Ensure this import
import 'bootstrap/dist/css/bootstrap.min.css';

const StatusPrivacy = ({ handleBackClick }) => {
  const [selectedOption, setSelectedOption] = useState('contacts');

  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}
    >
      {/* Header with Back Button */}
      <div className="border-bottom d-flex align-items-center px-3 py-3">
        <ChevronLeft className="me-3" onClick={handleBackClick} style={{ cursor: 'pointer' }} />
        <h5 className="mb-0 fw-semibold">Status privacy</h5>
      </div>

      {/* Body */}
      <div className="px-3 px-sm-4 px-md-5 pt-4">
        <div className="mb-3 text-secondary">Who can see my status updates</div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="radio"
            name="statusPrivacy"
            id="option1"
            checked={selectedOption === 'contacts'}
            onChange={() => setSelectedOption('contacts')}
          />
          <label className="form-check-label ms-2" htmlFor="option1">
            My contacts
          </label>
        </div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="radio"
            name="statusPrivacy"
            id="option2"
            checked={selectedOption === 'contactsExcept'}
            onChange={() => setSelectedOption('contactsExcept')}
          />
          <label className="form-check-label d-flex align-items-center ms-2" htmlFor="option2">
            My contacts except...
            <span className="ms-2 text-success small">0 excluded</span>
          </label>
        </div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="radio"
            name="statusPrivacy"
            id="option3"
            checked={selectedOption === 'onlyShareWith'}
            onChange={() => setSelectedOption('onlyShareWith')}
          />
          <label className="form-check-label d-flex align-items-center ms-2" htmlFor="option3">
            Only share with...
            <span className="ms-2 text-success small">0 included</span>
          </label>
        </div>

        <div className="text-secondary small pt-2 pb-5">
          Changes to your privacy settings won't affect status updates that you've sent already
        </div>
      </div>
    </div>
  );
};

export default StatusPrivacy;
