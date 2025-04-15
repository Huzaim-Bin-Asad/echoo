import React from "react";
import ContactItem from "./ContactItem";

export const contacts = [
  { name: "Bin Asad (You)", message: "Message yourself" },
  { name: "-Ma'am Ayesha-", message: "💕" },
  { name: ".Haafiz." },
  { name: "~Maryum" },
  { name: "~Seemab" },
  { name: "Hey there!", message: "I am using WhatsApp." },
  { name: "Aamna Aapi" },
  {
    name: "Ma'am Aleena",
    message: "We don't know who's praying for us and who's playing with us",
  },
];

const ContactList = () => {
  return (
    <div className="pt-3">
      <small className="text-white px-3 fw-bold fs-6 pb-6">
        Contacts on Echoo
      </small>
      <div className="d-flex flex-column mt-2 pb-5">
  {contacts.map((contact, index) => (
    <div key={index} className="mb-4">
      <ContactItem {...contact} />
    </div>
  ))}
</div>

    </div>
  );
};

export default ContactList;
