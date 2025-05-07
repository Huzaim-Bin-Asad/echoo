import React, { useState } from 'react';
import { ChevronLeft, Check, User, UserX, Users } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StatusPrivacy = ({ handleBackClick }) => {
  const [selectedOption, setSelectedOption] = useState('contacts');

  return (
    <div
      className="container-fluid"
      style={{ 
        backgroundColor: '#121212', 
        minHeight: '100vh', 
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Header with Back Button */}
      <div 
        className="border-bottom d-flex align-items-center px-3 py-3"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <ChevronLeft 
          className="me-3" 
          onClick={handleBackClick} 
          style={{ 
            cursor: 'pointer',
            width: '24px',
            height: '24px'
          }} 
        />
        <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem' }}>Status Privacy</h5>
      </div>

      {/* Body */}
      <div className="px-3 px-sm-4 px-md-5 pt-4">
        <div 
          className="mb-3 text-secondary" 
          style={{ 
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.6)'
          }}
        >
          Who can see my status updates
        </div>

        {/* Option 1: My Contacts */}
        <div 
          className="d-flex align-items-center justify-content-between mb-4 p-3 rounded-3"
          style={{ 
            backgroundColor: selectedOption === 'contacts' ? 'rgba(40, 167, 69, 0.1)' : 'transparent',
            border: selectedOption === 'contacts' ? '1px solid rgba(40, 167, 69, 0.3)' : '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedOption('contacts')}
        >
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
              <User size={18} color={selectedOption === 'contacts' ? '#28a745' : 'rgba(255,255,255,0.6)'} />
            </div>
            <div>
              <div className="fw-medium">My contacts</div>
            </div>
          </div>
          {selectedOption === 'contacts' && <Check size={18} color="#28a745" />}
        </div>

        {/* Option 2: My contacts except... */}
        <div 
          className="d-flex align-items-center justify-content-between mb-4 p-3 rounded-3"
          style={{ 
            backgroundColor: selectedOption === 'contactsExcept' ? 'rgba(40, 167, 69, 0.1)' : 'transparent',
            border: selectedOption === 'contactsExcept' ? '1px solid rgba(40, 167, 69, 0.3)' : '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedOption('contactsExcept')}
        >
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
              <UserX size={18} color={selectedOption === 'contactsExcept' ? '#28a745' : 'rgba(255,255,255,0.6)'} />
            </div>
            <div>
              <div className="fw-medium">My contacts except...</div>
              <div className="text-success small mt-1">0 excluded</div>
            </div>
          </div>
          {selectedOption === 'contactsExcept' && <Check size={18} color="#28a745" />}
        </div>

        {/* Option 3: Only share with... */}
        <div 
          className="d-flex align-items-center justify-content-between mb-4 p-3 rounded-3"
          style={{ 
            backgroundColor: selectedOption === 'onlyShareWith' ? 'rgba(40, 167, 69, 0.1)' : 'transparent',
            border: selectedOption === 'onlyShareWith' ? '1px solid rgba(40, 167, 69, 0.3)' : '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedOption('onlyShareWith')}
        >
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
              <Users size={18} color={selectedOption === 'onlyShareWith' ? '#28a745' : 'rgba(255,255,255,0.6)'} />
            </div>
            <div>
              <div className="fw-medium">Only share with...</div>
              <div className="text-success small mt-1">0 included</div>
            </div>
          </div>
          {selectedOption === 'onlyShareWith' && <Check size={18} color="#28a745" />}
        </div>

        {/* Footer note */}
        <div 
          className="text-secondary small pt-2 pb-5 px-2"
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.8rem',
            lineHeight: '1.4'
          }}
        >
          Changes to your privacy settings won't affect status updates that you've sent already
        </div>
      </div>
    </div>
  );
};

export default StatusPrivacy;