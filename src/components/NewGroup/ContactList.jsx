import React, { useEffect, useMemo, useState } from 'react';
import ContactItem from './ContactItem';

const ContactList = ({
  selected,
  toggleSelect,
  onContactsSeparated,
  filterBySource, // <-- new optional prop
}) => {
  const [recentlyContacted, setRecentlyContacted] = useState([]);
  const [hideStatusList, setHideStatusList] = useState([]);

  useEffect(() => {
    try {
      const rcRaw = localStorage.getItem('RecentlyContacted');
      const hsRaw = localStorage.getItem('HideStatusList');

      const rc = rcRaw ? JSON.parse(rcRaw) : [];
      const hs = hsRaw ? JSON.parse(hsRaw) : [];

      setRecentlyContacted(rc);
      setHideStatusList(hs);
    } catch (err) {
      console.error('[ContactList] Failed to parse localStorage items:', err);
    }
  }, []);

  const frequentlyContactedMapped = useMemo(() => {
    return recentlyContacted.map(rc => ({
      id: rc.other_user_id,
      userId: rc.other_user_id,
      name: rc.contact_name,
      profilePicture: rc.profile_picture,
      lastTextTime: rc.last_text_time,
      source: 'frequentlyContacted',
    }));
  }, [recentlyContacted]);

  const hideStatusMapped = useMemo(() => {
    return hideStatusList.map(hs => ({
      id: hs.receiver_id,
      userId: hs.receiver_id,
      name: hs.contact_name || hs.receiver_full_name,
      profilePicture: hs.receiver_profile_picture,
      source: 'hideStatusList',
    }));
  }, [hideStatusList]);

  useEffect(() => {
    const payload = {
      frequentlyContacted: frequentlyContactedMapped,
      hideStatusContacts: hideStatusMapped,
    };


    if (onContactsSeparated) {
      onContactsSeparated(payload);
    }
  }, [frequentlyContactedMapped, hideStatusMapped, onContactsSeparated]);

const renderContacts = (contacts) =>
  contacts.map((contact) => (
    <div
      key={contact.id}
      className="mb-3"
      onClick={() => {
                toggleSelect(contact);
      }}
    >
      <input type="hidden" value={contact.userId} />
      <ContactItem
        name={contact.name}
        profilePicture={contact.profilePicture}
        selected={selected.some(s => s.id === contact.id)}
        lastTextTime={contact.lastTextTime}
      />
    </div>
  ));


  return (
    <div className="d-flex flex-column mt-3 ">
      {/* Conditionally render sections based on filterBySource */}
      {(!filterBySource || filterBySource === 'frequentlyContacted') &&
        frequentlyContactedMapped.length > 0 && renderContacts(frequentlyContactedMapped)}

      {(!filterBySource || filterBySource === 'hideStatusList') &&
        hideStatusMapped.length > 0 && renderContacts(hideStatusMapped)}

      {/* Fallback if both are empty and no filter is applied */}
      {!filterBySource &&
        frequentlyContactedMapped.length === 0 &&
        hideStatusMapped.length === 0 && (
          <p className="text-center text-muted mt-4">No contacts available.</p>
      )}
    </div>
  );
};

export default ContactList;
