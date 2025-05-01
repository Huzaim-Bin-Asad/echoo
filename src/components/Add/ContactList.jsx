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
    contactId: user.user.user_id, // Using user_id for current user
    sender_id: user.user.user_id,
    receiver_id: user.user.user_id,
    name: `${user.user.full_name} (You)`,
    message: "Message yourself",
    profilePicture: user.user.profile_picture,
  };

  const contacts = (user.contacts || []).map((contact) => ({
    contactId: contact.contact_id,
    sender_id: contact.sender_id,
    receiver_id: contact.receiver_id,
    name: contact.contact_name,
    message: contact.about_message,
    profilePicture: contact.profile_picture,
  }));

  const handleContactClick = (senderId, receiverId, contactId, name) => {
    console.log(`[Click] Contact clicked: ${name}`);
    localStorage.setItem("sender_id", senderId);
    localStorage.setItem("receiver_id", receiverId);
    localStorage.setItem("contact_id", contactId);

    console.log(`[Set] sender_id = ${senderId}`);
    console.log(`[Set] receiver_id = ${receiverId}`);
    console.log(`[Set] contact_id = ${contactId}`);
    console.log("[Redirect] Navigating to /echoo...");

    localStorage.setItem("echoo_active_view", "chat");
    navigate("/echoo");
      };

  return (
    <div className="pt-3">
      <small className="text-white px-3 fw-bold fs-6 pb-6">
        Contacts on Echoo
      </small>

      <div className="d-flex flex-column mt-2 pb-5">
        <div
          className="mb-4"
          key={currentUser.contactId}
          sender-id={currentUser.sender_id}
          receiver-id={currentUser.receiver_id}
        >
          <ContactItem
            name={currentUser.name}
            message={currentUser.message}
            profilePicture={currentUser.profilePicture}
            onClick={() =>
              handleContactClick(
                currentUser.sender_id,
                currentUser.receiver_id,
                currentUser.contactId,
                currentUser.name
              )
            }
          />
        </div>

        {contacts.map((contact) => (
          <div
            className="mb-4"
            key={contact.contactId}
            sender-id={contact.sender_id}
            receiver-id={contact.receiver_id}
          >
            <ContactItem
              name={contact.name}
              message={contact.message}
              profilePicture={contact.profilePicture}
              onClick={() =>
                handleContactClick(
                  contact.sender_id,
                  contact.receiver_id,
                  contact.contactId,
                  contact.name
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
