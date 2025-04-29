import React from "react";
import ContactItem from "./ContactItem";
import { useUser } from "../../services/UserContext"; // Correct import path

const ContactList = () => {
  const { user } = useUser();

  if (!user || !user.user) {
    return null; // or a loading spinner
  }

  // Current logged-in user
  const currentUser = {
    id: user.user.user_id, // <-- real user_id
    name: `${user.user.first_name} ${user.user.last_name} (You)`,
    message: "Message yourself",
    profilePicture: user.user.profile_picture,
  };

  // Contacts (dynamic from server)
  const contacts = (user.contacts || []).map(contact => ({
    id: contact.contacted_id, // <-- real contacted user id (NOT contact_id)
    contactId: contact.contact_id, // <-- keep contact_id separately if you need
    name: contact.contact_name,
    message: contact.about_message,
    profilePicture: contact.profile_picture,
  }));

  return (
    <div className="pt-3">
      <small className="text-white px-3 fw-bold fs-6 pb-6">
        Contacts on Echoo
      </small>

      <div className="d-flex flex-column mt-2 pb-5">
        {/* Current User at top */}
        <div className="mb-4" key={currentUser.id} id={currentUser.id}>
  <ContactItem
    id={currentUser.id}  // Also pass id to ContactItem
    name={currentUser.name}
    message={currentUser.message}
    profilePicture={currentUser.profilePicture}
  />
</div>


        {/* Other Contacts */}
        {contacts.map((contact) => (
          <div className="mb-4" key={contact.id} id={contact.id}>
            <ContactItem
              name={contact.name}
              message={contact.message}
              profilePicture={contact.profilePicture}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
