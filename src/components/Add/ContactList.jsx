import React from "react";
import ContactItem from "./ContactItem";
import { useUser } from "../../services/UserContext";
import { useNavigate } from "react-router-dom";

const ContactList = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user || !user.user) {
    return null;
  }

  const currentUser = {
    id: user.user.user_id,
    name: `${user.user.first_name} ${user.user.last_name} (You)`,
    message: "Message yourself",
    profilePicture: user.user.profile_picture,
  };

  const contacts = (user.contacts || []).map((contact) => ({
    id: contact.contacted_id, // corrected to real contacted user ID
    contactId: contact.contact_id,
    name: contact.contact_name,
    message: contact.about_message,
    profilePicture: contact.profile_picture,
  }));

  const handleContactClick = (id, name) => {
    localStorage.setItem("selectedContactId", id);
  
    if (name.includes("(You)")) {
      localStorage.setItem("selectedContactType", "currentUser");
    } else {
      localStorage.setItem("selectedContactType", "contactUser");
    }
  
    navigate("/echoo", { state: { openChat: true } });
  };
  
  return (
    <div className="pt-3">
      <small className="text-white px-3 fw-bold fs-6 pb-6">
        Contacts on Echoo
      </small>

      <div className="d-flex flex-column mt-2 pb-5">
        <div className="mb-4" key={currentUser.id} id={currentUser.id}>
        <ContactItem
  id={currentUser.id}
  name={currentUser.name}
  message={currentUser.message}
  profilePicture={currentUser.profilePicture}
  onClick={() => handleContactClick(currentUser.id, currentUser.name)}
/>

        </div>

        {contacts.map((contact) => (
  <div className="mb-4" key={contact.id} id={contact.id}>
    <ContactItem
      id={contact.id}
      name={contact.name}
      message={contact.message}
      profilePicture={contact.profilePicture}
      onClick={() => handleContactClick(contact.id, contact.name)}
    />
  </div>
))}
      </div>
    </div>
  );
};

export default ContactList;
