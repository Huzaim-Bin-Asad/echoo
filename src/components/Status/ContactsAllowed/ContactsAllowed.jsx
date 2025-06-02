import React, { useState, useMemo } from "react";
import { CheckCircle, Circle } from "lucide-react";
import Header from "./Header";

// Safe JSON parse util
const safeParseJSON = (str) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Map HideStatusList to contacts with type 'all'
const getAllContactsFromStorage = () => {
  const raw = localStorage.getItem("HideStatusList");
  if (!raw) return [];

  const parsed = safeParseJSON(raw);
  return parsed
    .map(contact => ({
      id: contact.contact_id || "",
      name: contact.contact_name || "Unnamed",
      avatar: contact.receiver_profile_picture,
      type: "all",
    }))
    .filter(c => c.id && c.name)
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Map RecentlyContacted to contacts with type 'frequent'
const getFrequentContactsFromStorage = () => {
  const raw = localStorage.getItem("RecentlyContacted");
  if (!raw) return [];

  const parsed = safeParseJSON(raw);
  return parsed
    .map(contact => ({
      id: contact.other_user_id || "",
      name: contact.contact_name || "Unnamed",
      avatar: contact.profile_picture,
      type: "frequent",
    }))
    .filter(c => c.id && c.name)
    .sort((a, b) => a.name.localeCompare(b.name));
};

const ContactsAllowed = ({ handleBackClick }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const frequentlyContacted = useMemo(() => getFrequentContactsFromStorage(), []);
  const allContactsRaw = useMemo(() => getAllContactsFromStorage(), []);

  const frequentlyContactedIds = new Set(frequentlyContacted.map(c => c.id));
  const allContacts = allContactsRaw.filter(c => !frequentlyContactedIds.has(c.id));

  const toggleSelectAll = () => {
    const combinedContacts = [...frequentlyContacted, ...allContacts];
    if (selectedIds.length === combinedContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(combinedContacts.map(c => c.id));
    }
  };

  const toggleContact = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // Render avatar or fallback placeholder circle
  const Avatar = ({ avatarUrl, name }) => {
    return avatarUrl ? (
      <img
        src={avatarUrl}
        alt={name}
        className="rounded-circle me-3"
        style={{ width: 40, height: 40, objectFit: "cover" }}
      />
    ) : (
      <div
        className="rounded-circle me-3 bg-secondary"
        style={{ width: 40, height: 40 }}
        aria-hidden="true"
      />
    );
  };

  // Inlined FrequentlyContacted component JSX
  const FrequentlyContacted = ({ contacts, selectedIds, onToggle }) => {
    if (contacts.length === 0) return null;

    return (
      <>
        <h6 className="text-muted mb-3">Frequently contacted</h6>
        <div>
          {contacts.map((contact) => {
            const isSelected = selectedIds.includes(contact.id);

            return (
              <div
                key={contact.id}
                className="d-flex align-items-center justify-content-between py-2 border-bottom"
              >
                <div className="d-flex align-items-center">
                  <Avatar avatarUrl={contact.avatar} name={contact.name} />
                  <span>{contact.name}</span>
                </div>

                <div
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => onToggle(contact.id)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      onToggle(contact.id);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                  aria-label={`Select contact ${contact.name}`}
                >
                  {isSelected ? (
                    <CheckCircle color="#B784B7" />
                  ) : (
                    <Circle color="#F5F0F6" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="bg-light text-dark vh-100 d-flex flex-column">
      <Header
        selectedCount={selectedIds.length}
        totalCount={frequentlyContacted.length + allContacts.length}
        handleBackClick={handleBackClick}
        onSelectAll={toggleSelectAll}
      />
      <div className="flex-grow-1 overflow-auto px-3 py-3">
        {frequentlyContacted.length > 0 && (
          <FrequentlyContacted
            contacts={frequentlyContacted}
            selectedIds={selectedIds}
            onToggle={toggleContact}
          />
        )}

        {allContacts.length > 0 && (
          <div className="mt-4">
            <div className="mb-2">Contacts on Echho</div>
            {allContacts.map((contact) => {
              const isSelected = selectedIds.includes(contact.id);
              return (
                <div
                  key={contact.id}
                  className="d-flex align-items-center justify-content-between py-2 border-bottom"
                >
                  <div className="d-flex align-items-center">
                    <Avatar avatarUrl={contact.avatar} name={contact.name} />
                    <span>{contact.name}</span>
                  </div>
                  <div
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => toggleContact(contact.id)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        toggleContact(contact.id);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                    aria-label={`Select contact ${contact.name}`}
                  >
                    {isSelected ? (
                      <CheckCircle color="#B784B7" />
                    ) : (
                      <Circle color="#F5F0F6" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {frequentlyContacted.length === 0 && allContacts.length === 0 && (
          <p className="text-center text-muted">No contacts to show.</p>
        )}
      </div>
    </div>
  );
};

export default ContactsAllowed;
