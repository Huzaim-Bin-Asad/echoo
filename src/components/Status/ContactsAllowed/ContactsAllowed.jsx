import React, { useState } from "react";
import Header from "./Header";
import FrequentlyContacted from "./FrequentlyContacted";
import AllContacts from "./AllContacts";

const dummyContacts = [
  { id: 1, name: "CutiePie 😢🤍", type: "frequent" },
  { id: 2, name: "Tehmi", type: "frequent" },
  { id: 3, name: "Bhai 🖤", type: "frequent" },
  { id: 4, name: "Eman 🦋", type: "frequent" },
  { id: 5, name: "Soil 🎀", type: "frequent" },
  { id: 6, name: "_salihaa_✨", type: "all" },
  { id: 7, name: ".", type: "all" },
  { id: 8, name: "~وریشـہ~", type: "all" },
  { id: 9, name: "Aalia Khala", type: "all" },
  { id: 10, name: "ABDULLA Saulleh", type: "all" },
  { id: 11, name: "Abrish Hafeez", type: "all" },
];

const ContactsAllowed = ({ handleBackClick }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === dummyContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(dummyContacts.map((c) => c.id));
    }
  };

  const toggleContact = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const frequentlyContacted = dummyContacts.filter(
    (c) => c.type === "frequent"
  );
  const allContacts = dummyContacts.filter((c) => c.type === "all");

  return (
    <div className="bg-dark text-white vh-100 d-flex flex-column">
      <Header
        selectedCount={selectedIds.length}
        totalCount={dummyContacts.length}
        handleBackClick={handleBackClick}  // Forwarding here
        onSelectAll={toggleSelectAll}
      />
      <div className="flex-grow-1 overflow-auto px-3">
        <FrequentlyContacted
          contacts={frequentlyContacted}
          selectedIds={selectedIds}
          onToggle={toggleContact}
        />
        <AllContacts
          contacts={allContacts}
          selectedIds={selectedIds}
          onToggle={toggleContact}
        />
      </div>
    </div>
  );
};

export default ContactsAllowed;
