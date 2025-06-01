import React from "react";

const AllContacts = ({ contacts = [], selectedIds = [], onToggle }) => {
  return (
    <div className="mt-4">
      <div className=" mb-2">Contacts on Echho</div>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="d-flex align-items-center justify-content-between py-2 border-bottom"
        >
          <div className="d-flex align-items-center">
            {/* Placeholder circle - replace with image if available */}
            <div
              className="rounded-circle bg-secondary me-3"
              style={{ width: 40, height: 40 }}
              aria-hidden="true"
            />
            <span>{contact.name}</span>
          </div>
          <input
            type="checkbox"
            aria-label={`Select contact ${contact.name}`}
            checked={selectedIds.includes(contact.id)}
            onChange={() => onToggle(contact.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default AllContacts;
