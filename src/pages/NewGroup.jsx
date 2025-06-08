import React, { useState } from 'react';
import Header from '../components/NewGroup/Header';
import ContactList from '../components/NewGroup/ContactList';
import SelectedContacts from '../components/NewGroup/SelectedContacts';
import ChevronButton from '../components/NewGroup/ChevronButton';
import GroupMetaData from '../components/NewGroup/GroupMetaData';
import GroupPermissions from '../components/NewGroup/permissions/GroupPermissions'; // ✅ Import

const NewGroup = () => {
  const [combinedContacts, setCombinedContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showGroupMetaData, setShowGroupMetaData] = useState(false);
  const [showGroupPermissions, setShowGroupPermissions] = useState(false);

  const toggleSelect = (contact) => {
    setSelected((prevSelected) => {
      const isSelected = prevSelected.some((c) => c.id === contact.id);
      const newSelected = isSelected
        ? prevSelected.filter((c) => c.id !== contact.id)
        : [...prevSelected, contact];

      return newSelected;
    });
  };

  const handleChevronClick = () => {
    if (selected.length > 0) {
      setShowGroupMetaData(true);
      setShowGroupPermissions(false);
    } else {
      alert('Please select at least one contact.');
    }
  };

  // Callback to handle "Group permissions" action from GroupMetaData
  const handleGroupSettingAction = (action) => {
    if (action === "group-setting") {
      setShowGroupPermissions(true);
      setShowGroupMetaData(false);
    }
  };

  // Callback for back action from GroupPermissions to reopen GroupMetaData
  const handleBackFromPermissions = () => {
    setShowGroupPermissions(false);
    setShowGroupMetaData(true);
  };

  // Render GroupPermissions exclusively when active
  if (showGroupPermissions) {
    return <GroupPermissions onBack={handleBackFromPermissions} />;
  }

  // Render GroupMetaData exclusively when active, passing members and callback
  if (showGroupMetaData) {
    return (
      <GroupMetaData
        members={selected}
        onGroupSettingAction={handleGroupSettingAction}
      />
    );
  }

  // Default view: selection UI
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

      <ChevronButton onClick={handleChevronClick} data={selected} />
    </div>
  );
};

export default NewGroup;
