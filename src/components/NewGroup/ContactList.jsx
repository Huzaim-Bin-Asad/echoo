import React from 'react';
import ContactItem from './ContactItem';

export const contacts = [
  { name: "Bin Asad (You)", message: "Message yourself" },
  { name: "-Ma'am Ayesha-", message: "❤️" },
  { name: ".Haafiz." },
  { name: "~Maryum" },
  { name: "~Seemab" },
  { name: "Hey there!", message: "I am using WhatsApp." },
  { name: "Aamna Aapi" },
  {
    name: "Ma'am Aleena",
    message: "We don't know who's praying for us and who's playing with us"},
    { name: "Bin Asad (You)", message: "Message yourself" },
    { name: "-Ma'am Ayesha-", message: "❤️" },
    { name: ".Haafiz." },
    { name: "~Maryum" },
    { name: "~Seemab" },
    { name: "Hey there!", message: "I am using WhatsApp." },
    { name: "Aamna Aapi" },
  
];

const ContactList = ({ contacts, selected, toggleSelect }) => (
  <div className="d-flex flex-column mt-2 pb-5">
    {contacts.map((contact, index) => (
      <div key={index} className="mb-3" onClick={() => toggleSelect(contact)}>
        <ContactItem {...contact} selected={selected.includes(contact)} />
      </div>
    ))}
  </div>
);

export default ContactList;
