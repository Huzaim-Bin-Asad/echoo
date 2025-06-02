import React, { useEffect } from "react";
import { CheckCircle, Circle, Check } from "lucide-react";

const ContactList = ({ contacts = [], selected = [], onToggle, onSelectedCountChange }) => {
  useEffect(() => {
    const selectedReceiverIds = contacts
      .filter(contact => selected.includes(contact.id))
      .map(contact => contact.receiverId);

    console.log("✅ Selected receiver_id(s):", selectedReceiverIds);

    // Notify parent of how many are selected
    if (typeof onSelectedCountChange === "function") {
      onSelectedCountChange(selectedReceiverIds.length);
    }
  }, [selected, contacts, onSelectedCountChange]);

  if (!Array.isArray(contacts) || contacts.length === 0) {
    return <div>No contacts found</div>;
  }

  return (
    <div className="position-relative">
      <div className="list-group">
        {contacts.map((contact) => {
          const isSelected = selected.includes(contact.id);

          return (
            <div
              key={contact.id}
              data-receiver-id={contact.receiverId}
              className="list-group-item d-flex align-items-center justify-content-between"
              onClick={() => onToggle && onToggle(contact.id)}
              style={{
                cursor: "pointer",
                borderTop: "none",
                borderRight: "none",
                borderLeft: "none",
                width: "100%",
                padding: "10px 0",
              }}
            >
              <div className="d-flex align-items-center">
                <img
                  src={contact.avatar || "https://via.placeholder.com/36"}
                  alt={contact.name || "Contact"}
                  className="rounded-circle me-2"
                  width="36"
                  height="36"
                />
                <div>
                  <span className="fw-semibold">{contact.name || "Unnamed"}</span>
                  <span style={{ display: "none" }} className="receiver-id">
                    {contact.receiverId}
                  </span>
                </div>
              </div>
              {isSelected ? (
                <CheckCircle color="#B784B7" />
              ) : (
                <Circle color="#D3D3D3" />
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky square with check icon */}
      <div
        className="position-fixed d-flex align-items-center justify-content-center"
        style={{
          bottom: "20px",
          right: "10px",
          width: "35px",
          height: "35px",
          borderRadius: "6px",
          backgroundColor: "#D3D3D3",
          border: "1px solid #B784B7",
          zIndex: 9999,
        }}
      >
        <Check size={28} color="#B784B7" />
      </div>
    </div>
  );
};

export default ContactList;
