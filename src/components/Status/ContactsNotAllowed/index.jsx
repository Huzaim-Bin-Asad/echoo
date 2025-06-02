import React, { useEffect, useState } from "react";
import Header from "./Header";
import ContactList from "./ContactList";
import contacts from "./contactData";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const ContactsNotAllowed = ({ handleBackClick, initialExcludedContacts = [] }) => {
  // Use selectedReceiverIds as main selection state (array of receiverIds)
  const [selectedReceiverIds, setSelectedReceiverIds] = useState([]);
  const [excludedMemory, setExcludedMemory] = useState([]);

  // Initialize selectedReceiverIds from initialExcludedContacts prop
  useEffect(() => {
    if (initialExcludedContacts && initialExcludedContacts.length > 0) {
      setSelectedReceiverIds(initialExcludedContacts);
    }
  }, [initialExcludedContacts]);

  // Load excludedMemory from localStorage on mount
  useEffect(() => {
    const storedExcluded = localStorage.getItem("ContactsExcludedMemory");
    if (storedExcluded) {
      try {
        const parsed = JSON.parse(storedExcluded);
        if (Array.isArray(parsed)) {
          setExcludedMemory(parsed);
          // Optionally initialize selection from localStorage if needed
          setSelectedReceiverIds(parsed);
        }
      } catch (err) {
        console.error("Failed to parse ContactsExcludedMemory from localStorage", err);
      }
    }
  }, []);

  // Check if all contacts' receiverIds are selected
  const allSelected = contacts.length > 0 && contacts.every(c => selectedReceiverIds.includes(c.receiverId));

  // Toggle all: select all receiverIds or clear all
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedReceiverIds([]);
    } else {
      setSelectedReceiverIds(contacts.map(c => c.receiverId));
    }
  };

  // Toggle individual contact by receiverId
  const toggleContact = (receiverId) => {
    setSelectedReceiverIds(prev =>
      prev.includes(receiverId)
        ? prev.filter(id => id !== receiverId)
        : [...prev, receiverId]
    );
  };

  const handleCheckClick = async () => {
    console.log("✅ Sticky check button clicked");
    console.log("Selected receiver IDs:", selectedReceiverIds);

    localStorage.setItem("ContactsExcludedMemory", JSON.stringify(selectedReceiverIds));

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      console.error("User not found in localStorage");
      return;
    }

    let user;
    try {
      user = JSON.parse(userStr);
    } catch (err) {
      console.error("Failed to parse user JSON from localStorage", err);
      return;
    }

    const user_id = user.user_id;
    if (!user_id) {
      console.error("user_id missing in user object");
      return;
    }

    const payload = {
      user_id,
      contacts_except: selectedReceiverIds,
    };

    try {
      const response = await fetch("http://localhost:5000/api/update-except", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update status privacy:", errorData.message);
        return;
      }

      const data = await response.json();
      console.log("Status privacy updated:", data.message);
      // Optionally add UI feedback here
    } catch (error) {
      console.error("Error sending update-except request:", error);
    }
  };

  return (
    <div 
      className="container-fluid py-3" 
      style={{ backgroundColor: "white", position: "relative", minHeight: "100vh" }} 
    >
      <Header 
        selectedCount={selectedReceiverIds.length}
        onSelectAll={toggleSelectAll}
        onBackClick={handleBackClick} 
      />
      <ContactList 
        contacts={contacts} 
        selected={selectedReceiverIds} 
        onToggle={toggleContact}
        onSelectedReceiverIdsChange={setSelectedReceiverIds}
        excludedMemory={excludedMemory}  // optional
      />

      {/* Sticky check button */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Confirm selection"
        onClick={handleCheckClick}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleCheckClick();
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
          justifyContent: "center"
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

export default ContactsNotAllowed;
