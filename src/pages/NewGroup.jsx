import React, { useState } from 'react';
import Header from '../components/NewGroup/Header';
import ContactList from '../components/NewGroup/ContactList';
import SelectedContacts from '../components/NewGroup/SelectedContacts';
import ChevronButton from '../components/NewGroup/ChevronButton';

const NewGroup = () => {
  const [combinedContacts, setCombinedContacts] = useState([]);
  const [selected, setSelected] = useState([]);

const toggleSelect = (contact) => {
  setSelected((prevSelected) => {
    const isSelected = prevSelected.some((c) => c.id === contact.id);
    let newSelected;
    if (isSelected) {
      newSelected = prevSelected.filter((c) => c.id !== contact.id);
    } else {
      newSelected = [...prevSelected, contact];
    }
    console.log('Updated selected contacts:', newSelected);
    return newSelected;
  });
};



  return (
    <div className="bg-dark text-white min-vh-100">
      <Header count={selected.length} total={combinedContacts.length} />

      {selected.length > 0 && (
        <SelectedContacts selected={selected} toggleSelect={toggleSelect} />
      )}

      <div className="px-3">
        <small className="fw-bold d-block mt-4">Recently Contacted</small>
        <ContactList
          selected={selected}
          toggleSelect={toggleSelect}
          filterBySource="frequentlyContacted"
        />

        <small className="fw-bold d-block mt-2">Contacts on Echoo</small>
        <ContactList
          selected={selected}
          toggleSelect={toggleSelect}
          filterBySource="hideStatusList"
        />
      </div>

      <ChevronButton />
    </div>
  );
};

export default NewGroup;
