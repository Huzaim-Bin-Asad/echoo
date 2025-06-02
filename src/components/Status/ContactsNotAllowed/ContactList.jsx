import React, { useEffect } from "react";
import { CheckCircle, Circle } from "lucide-react";

const ContactList = ({
  contacts = [],
  selected = [], // array of receiverIds now
  onToggle,
  onSelectedCountChange,
  onSelectedReceiverIdsChange,
}) => {
  useEffect(() => {
    // selected already contains receiverIds, so length is count
    console.log("✅ Selected receiver_id(s):", selected);

    if (typeof onSelectedCountChange === "function") {
      onSelectedCountChange(selected.length);
    }
    if (typeof onSelectedReceiverIdsChange === "function") {
      onSelectedReceiverIdsChange(selected);
    }
  }, [selected, onSelectedCountChange, onSelectedReceiverIdsChange]);

  if (!Array.isArray(contacts) || contacts.length === 0) {
    return <div>No contacts found</div>;
  }

  return (
    <div className="position-relative">
      <div className="list-group">
        {contacts.map((contact) => {
          // check if contact.receiverId is in selected array
          const isSelected = selected.includes(contact.receiverId);

          return (
            <div
              key={contact.id}
              data-receiver-id={contact.receiverId}
              className="list-group-item d-flex align-items-center justify-content-between"
              onClick={() => onToggle && onToggle(contact.receiverId)} // toggle by receiverId now
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
    </div>
  );
};

export default ContactList;
