import React, { useState, useEffect } from "react";
import { ChevronLeft, User, ShieldBan, HandCoins } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import fetchStatusPrivacy from "./getStatusPrivacy";

// Utility functions
const getContactsExcludedMemory = () => {
  try {
    const stored = localStorage.getItem("ContactsExcludedMemory");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getContactsIncludedMemory = () => {
  try {
    const stored = localStorage.getItem("ContactsIncludedMemory");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const StatusPrivacy = ({
  handleBackClick,
  onOnlyShareWithClick,
  onContactsExceptClick,
}) => {
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [excludedCount, setExcludedCount] = useState(0);
  const [includedCount, setIncludedCount] = useState(0);

  useEffect(() => {
    const storedOption = localStorage.getItem("StatusOptionSelected");

    if (storedOption) {
      setSelectedOption(storedOption);
    } else {
      fetchStatusPrivacy().then((data) => {
        const type = data?.type_selected || "contacts";

        if (type === "all") setSelectedOption("contacts");
        else if (type === "except") setSelectedOption("contactsExcept");
        else if (type === "included") setSelectedOption("onlyShareWith");
      });
    }
  }, []);

  // Update counts on mount + every 3s
  useEffect(() => {
    const updateCounts = () => {
      const excluded = getContactsExcludedMemory();
      const included = getContactsIncludedMemory();
      setExcludedCount(Array.isArray(excluded) ? excluded.length : 0);
      setIncludedCount(Array.isArray(included) ? included.length : 0);
    };

    updateCounts();
    const interval = setInterval(updateCounts, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendPrivacySelection = async (selectionType) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user?.user_id;

      if (!user_id) {
        console.error("User ID not found in localStorage");
        return;
      }

      const response = await fetch(
        "https://echoo-backend.vercel.app/api/status-privacy-update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, type_selected: selectionType }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status privacy");

      console.log("Privacy setting updated:", selectionType);
    } catch (error) {
      console.error("Error sending privacy selection:", error);
    }
  };

  const mauve = {
    background: "#F5F0F6",
    card: "#FFFFFF",
    primary: "#B784B7",
    border: "#E0CFE2",
    noteText: "#9D76C1",
    iconInactive: "#AAA",
    text: "#333",
  };

  const options = [
    {
      key: "contacts",
      label: "My contacts",
      icon: <User size={18} />,
    },
    {
      key: "contactsExcept",
      label: "My contacts except...",
      icon: <ShieldBan size={18} />,
      note: `${excludedCount} excluded`,
      onNoteClick: onContactsExceptClick,
    },
    {
      key: "onlyShareWith",
      label: "Only share with...",
      icon: <HandCoins size={18} />,
      note: `${includedCount} included`,
      onNoteClick: onOnlyShareWithClick,
    },
  ];

  const getItemStyle = (optionKey) => ({
    backgroundColor:
      selectedOption === optionKey ? `${mauve.primary}20` : mauve.card,
    border:
      selectedOption === optionKey
        ? `1px solid ${mauve.primary}70`
        : `1px solid ${mauve.border}`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderRadius: "1rem",
    padding: "1rem",
    marginBottom: "1rem",
    color: mauve.text,
  });

  const getIconColor = (optionKey) =>
    selectedOption === optionKey ? mauve.primary : mauve.iconInactive;

  const handleOptionClick = (key) => {
    setSelectedOption(key);
    localStorage.setItem("StatusOptionSelected", key);

    if (key === "contacts") sendPrivacySelection("all");
    else if (key === "contactsExcept") sendPrivacySelection("except");
    else if (key === "onlyShareWith") sendPrivacySelection("included");
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: mauve.background,
        minHeight: "100vh",
        color: mauve.text,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        padding: "1rem",
      }}
    >
      {/* Header */}
      <div
        className="d-flex align-items-center mb-4"
        style={{
          borderBottom: `1px solid ${mauve.border}`,
          paddingBottom: "1rem",
        }}
      >
        <ChevronLeft
          onClick={handleBackClick}
          style={{
            cursor: "pointer",
            width: "24px",
            height: "24px",
            marginRight: "0.5rem",
            color: mauve.primary,
          }}
        />
        <h5 className="mb-0 fw-semibold" style={{ fontSize: "1.1rem" }}>
          Status Privacy
        </h5>
      </div>

      {/* Body */}
      <div>
        <div className="mb-3 text-muted" style={{ fontSize: "0.9rem" }}>
          Who can see my status updates
        </div>

        {options.map((option) => (
          <div
            key={option.key}
            className="d-flex align-items-center justify-content-between"
            style={getItemStyle(option.key)}
            onClick={() => handleOptionClick(option.key)}
          >
            <div className="d-flex align-items-center">
              <div
                className="d-flex justify-content-center align-items-center rounded-circle me-3"
                style={{
                  backgroundColor: `${mauve.primary}10`,
                  width: "40px",
                  height: "40px",
                }}
              >
                {React.cloneElement(option.icon, {
                  color: getIconColor(option.key),
                })}
              </div>
              <div className="fw-medium">{option.label}</div>
            </div>

            {option.note && (
              <div
                className="small"
                style={{ color: mauve.noteText, cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (option.onNoteClick) option.onNoteClick();
                }}
              >
                {option.note}
              </div>
            )}
          </div>
        ))}

        {/* Footer Note */}
        <div
          className="text-muted small pt-2 pb-5"
          style={{
            color: "#7C6A8B",
            fontSize: "0.8rem",
            lineHeight: "1.4",
          }}
        >
          Changes to your privacy settings won't affect status updates that
          you've sent already.
        </div>
      </div>
    </div>
  );
};

export default StatusPrivacy;
