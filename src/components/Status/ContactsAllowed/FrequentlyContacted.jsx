import React from "react";

const FrequentlyContacted = ({ contacts, selectedIds, onToggle }) => {
  if (contacts.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="text-muted mb-2">Frequently contacted</div>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="d-flex align-items-center justify-content-between py-2 border-bottom"
        >
          <div className="d-flex align-items-center">
            <div className="rounded-circle bg-secondary me-3" style={{ width: 40, height: 40 }} />
            <span>{contact.name}</span>
          </div>
          <input
            type="checkbox"
            checked={selectedIds.includes(contact.id)}
            onChange={() => onToggle(contact.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default FrequentlyContacted;
