import React from 'react';
import { CircleX } from 'lucide-react';

const getInitials = (name) => name?.[0]?.toUpperCase();

const SelectedContacts = ({ selected, toggleSelect }) => (
  <div className="d-flex px-3 py-2 overflow-auto gap-3 border-bottom border-secondary">
    {selected.map((contact, idx) => (
      <div key={idx} className="position-relative text-center">
        <div
          className="bg-secondary rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: 48, height: 48 }}
        >
          <span className="text-white fw-bold">{getInitials(contact.name)}</span>
        </div>
        <div
          className="position-absolute bg-dark rounded-circle p-1"
          style={{
            bottom: 16, // Adjust this to make it touch the circle
            right: -3,  // Adjust this to make it touch the circle
            cursor: 'pointer',
          }}
          onClick={() => toggleSelect(contact)}
        >
          <CircleX size={14} color="white" />
        </div>
        <small className="d-block mt-1" style={{ width: 60, fontSize: 10, marginLeft: -5 }}>
          {contact.name.split(' ')[0]}
        </small>
      </div>
    ))}
  </div>
);

export default SelectedContacts;
