import React, { useState, useMemo, useEffect } from "react";
import { CheckCircle, Circle } from "lucide-react";
import Header from "./Header";

const safeParseJSON = (str) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getAllContactsFromStorage = () => {
  const raw = localStorage.getItem("HideStatusList");
  if (!raw) return [];

  const parsed = safeParseJSON(raw);
  return parsed
    .map((contact) => ({
      id: contact.contact_id || "",
      name: contact.contact_name || "Unnamed",
      avatar: contact.receiver_profile_picture,
      type: "all",
      receiver_id: contact.receiver_id || "",
    }))
    .filter((c) => c.id && c.name)
    .sort((a, b) => a.name.localeCompare(b.name));
};

const getFrequentContactsFromStorage = () => {
  const raw = localStorage.getItem("RecentlyContacted");
  if (!raw) return [];

  const parsed = safeParseJSON(raw);
  return parsed
    .map((contact) => ({
      id: contact.other_user_id || "",
      name: contact.contact_name || "Unnamed",
      avatar: contact.profile_picture,
      type: "frequent",
      other_user_id: contact.other_user_id || "",
    }))
    .filter((c) => c.id && c.name)
    .sort((a, b) => a.name.localeCompare(b.name));
};

const ContactsAllowed = ({ handleBackClick }) => {
  const [selectedIds, setSelectedIds] = useState(() => {
    const saved = localStorage.getItem("ContactsIncludedMemory");
    return saved ? safeParseJSON(saved) : [];
  });

  const frequentlyContacted = useMemo(
    () => getFrequentContactsFromStorage(),
    []
  );
  const allContactsRaw = useMemo(() => getAllContactsFromStorage(), []);

  const idMap = useMemo(() => {
    const map = new Map();

    frequentlyContacted.forEach((fc) => {
      if (fc.other_user_id) {
        map.set(fc.other_user_id, fc.id);
      }
    });

    allContactsRaw.forEach((ac) => {
      if (ac.receiver_id) {
        map.set(ac.receiver_id, ac.id);
      }
    });

    return map;
  }, [frequentlyContacted, allContactsRaw]);

  const frequentlyContactedIds = new Set(frequentlyContacted.map((c) => c.id));
  const allContacts = allContactsRaw.filter(
    (c) => !frequentlyContactedIds.has(c.id)
  );

  useEffect(() => {
    localStorage.setItem("ContactsIncludedMemory", JSON.stringify(selectedIds));
  }, [selectedIds]);

  const toggleSelectAll = () => {
    const combinedIds = new Set([
      ...frequentlyContacted.map((c) => c.id),
      ...allContacts.map((c) => c.id),
    ]);
    setSelectedIds(
      selectedIds.length === combinedIds.size ? [] : Array.from(combinedIds)
    );
  };

  const toggleContact = (id) => {
    const matchId = [...idMap.entries()]
      .filter(([_, value]) => value === id || _ === id)
      .map(([key, value]) => (value === id ? key : value));

    setSelectedIds((prev) => {
      const idsToRemove = [id, ...matchId];
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter((cid) => !idsToRemove.includes(cid));
      } else {
        return [...new Set([...prev, id, ...matchId])];
      }
    });
  };

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
                data-other-user-id={contact.other_user_id || ""}
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

  const handleCheckClick = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        console.error("User not found in localStorage");
        return;
      }

      const userObj = JSON.parse(userStr);
      const userId = userObj.user_id;

      console.log("Selected contact IDs:", selectedIds);

      const response = await fetch(
        "http://localhost:5000/api/update-included",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            contacts_included: selectedIds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status privacy");
      }

      const data = await response.json();
      console.log("Update success:", data);

      // 👇 Trigger the same back behavior after successful update
      handleBackClick();
    } catch (error) {
      console.error("Error updating status privacy:", error);
    }
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
                  data-receiver-id={contact.receiver_id || ""}
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

      {/* Confirm selection button */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Confirm selection"
        onClick={handleCheckClick}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") handleCheckClick();
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "10px",
          width: "35px",
          height: "35px",
          borderRadius: "6px",
          backgroundColor: "#D3D3D3",
          border: "1px solid #B784B7",
          zIndex: 9999,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="none"
          stroke="#B784B7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-check"
          viewBox="0 0 24 24"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>
  );
};

export default ContactsAllowed;
