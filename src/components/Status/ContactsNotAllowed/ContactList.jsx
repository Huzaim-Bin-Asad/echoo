import React from "react";
import { CheckCircle, Circle } from "lucide-react";

const ContactList = ({ contacts, selected, onToggle }) => (
  <div className="list-group">
    {contacts.map(contact => {
      const isSelected = selected.includes(contact.id);
      return (
        <div 
          key={contact.id} 
          className="list-group-item d-flex align-items-center justify-content-between"
          onClick={() => onToggle(contact.id)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-center">
            <img 
              src={contact.avatar} 
              alt={contact.name} 
              className="rounded-circle me-2" 
              width="36" 
              height="36" 
            />
            <span>{contact.name}</span>
          </div>
          {isSelected ? (
            <CheckCircle color="green" />
          ) : (
            <Circle color="gray" />
          )}
        </div>
      );
    })}
  </div>
);

export default ContactList;

