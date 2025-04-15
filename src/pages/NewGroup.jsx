import React, { useState } from 'react';
import Header from '../components/NewGroup/Header';
import ContactList from '../components/NewGroup/ContactList';
import SelectedContacts from '../components/NewGroup/SelectedContacts';
import { contacts as allContacts } from '../components/NewGroup/ContactList';
import ContactItem from '../components/NewGroup/ContactItem';
import ChevronButton from '../components/NewGroup/ChevronButton'; // Import ChevronButton

const NewContact = () => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (contact) => {
    if (selected.includes(contact)) {
      setSelected(selected.filter((c) => c !== contact));
    } else {
      setSelected([...selected, contact]);
    }
  };

  const frequentlyContacted = allContacts.slice(0, 5);
  const others = allContacts.slice(5);

  return (
    <div className="bg-dark text-white min-vh-100">
      <Header count={selected.length} total={allContacts.length} />
      {selected.length > 0 && (
        <SelectedContacts selected={selected} toggleSelect={toggleSelect} />
      )}
      <div className="px-3">
        <small className="fw-bold">Frequently Contacted</small>
        <div className="d-flex flex-column mt-2">
          {frequentlyContacted.map((contact, idx) => (
            <div key={idx} onClick={() => toggleSelect(contact)}>
              <ContactItem {...contact} selected={selected.includes(contact)} />
            </div>
          ))}
        </div>
        <small className="fw-bold mt-4 d-block">Contacts on Echoo</small>
        <ContactList
          contacts={others}
          selected={selected}
          toggleSelect={toggleSelect}
        />
      </div>

      {/* Chevron Button */}
      <ChevronButton />
    </div>
  );
};

export default NewContact;
