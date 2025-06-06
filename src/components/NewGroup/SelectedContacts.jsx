import React from 'react';
import { CircleX } from 'lucide-react';

const getInitials = (name) => name?.[0]?.toUpperCase();

const SelectedContacts = ({ selected, toggleSelect }) => {

  return (
    <div className="d-flex px-3 py-2 overflow-auto gap-3 border-bottom border-secondary">
      {selected.map((contact, idx) => (
        <div key={idx} className="position-relative text-center">
          <div
            className="bg-secondary rounded-circle d-flex justify-content-center align-items-center overflow-hidden"
            style={{ width: 48, height: 48 }}
          >
            {contact.profilePicture ? (
              <img
                src={contact.profilePicture}
                alt={contact.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span className="text-white fw-bold" style={{ fontSize: '1.25rem' }}>
                {getInitials(contact.name)}
              </span>
            )}
          </div>

          <div
            className="position-absolute bg-dark rounded-circle p-1"
            style={{
              bottom: 18,
              right: -2,
              cursor: 'pointer',
              height: '20px',
              width: "20px"
            }}
            onClick={() => toggleSelect(contact)}
            aria-label={`Remove ${contact.name}`}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggleSelect(contact);
            }}
          >
            <CircleX size={14} color="red" style={{ marginBottom: '14px', marginRight: '12px' }} />
          </div>
          <small className="d-block mt-1" style={{ width: 60, fontSize: 10, marginLeft: -5 }}>
            {contact.name.split(' ')[0]}
          </small>
        </div>
      ))}
    </div>
  );
};

export default SelectedContacts;
