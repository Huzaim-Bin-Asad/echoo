import React, { useEffect, useState } from "react";
import Header from "./Header";
import ContactList from "./ContactList";
import contacts from "./contactData";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const ContactsNotAllowed = ({ handleBackClick, initialExcludedContacts = [] }) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    console.log("✅ ContactsNotAllowed mounted");
    if (initialExcludedContacts && initialExcludedContacts.length > 0) {
      console.log("🚀 Received excluded contacts:", initialExcludedContacts);
      setSelected(initialExcludedContacts);
    } else {
      console.log("ℹ️ No excluded contacts received.");
    }
  }, [initialExcludedContacts]);

  const allSelected = selected.length === contacts.length;

  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : contacts.map(contact => contact.id));
  };

  const toggleContact = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="container-fluid py-3">
      <Header 
        selectedCount={selected.length}
        onSelectAll={toggleSelectAll}
        onBackClick={handleBackClick} // ✅ Correct prop name expected by Header
      />
      <ContactList 
        contacts={contacts} 
        selected={selected} 
        onToggle={toggleContact} 
      />
    </div>
  );
};

export default ContactsNotAllowed;
