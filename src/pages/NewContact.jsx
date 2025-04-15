import React, { useState } from "react";
import { ChevronLeft } from "lucide-react"; // Import ChevronLeft icon
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for routing
import ContactNameForm from "../components/NewContacts/ContactNameForm";
import ContactInfoForm from "../components/NewContacts/ContactInfoForm";
import SaveButton from "../components/NewContacts/SaveButton";

const NewContact = () => {
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  const navigate = useNavigate(); // Initialize the navigation hook

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact saved:", contact);
    alert("Contact saved!");
  };

  const handleIconClick = () => {
    navigate("/add"); // Navigate to '/add' when the icon is clicked
  };

  return (
    <div className="bg-dark text-white d-flex justify-content-center align-items-center vh-100">
      {/* Container for the floating card */}
      <div
        className="p-4 rounded shadow-lg w-100"
        style={{
          maxWidth: "600px", // Max-width for large screens
          width: "90vw", // Default width for small screens
          minHeight: "100vh", // Increased height for all devices (1.3x)
          height: "auto", // Auto height adjustment based on content
          backgroundColor: "#67AE6E",
          position: "relative", // To position the Chevron icon correctly
        }}
      >
        {/* Chevron Left Icon on the left side */}
        <ChevronLeft
          size={30}
          style={{
            position: "absolute",
            left: "10px",
            top: "20px", // Adjusted to move the icon lower
            cursor: "pointer",
            color: "#fff",
          }}
          onClick={handleIconClick} // Trigger the redirection on click
        />

        <form onSubmit={handleSubmit}>
          {/* Heading aligned to the left with a slight margin */}
          <h3 className="text-start mb-4" style={{ marginLeft: "20px" }}>
            New Contact
          </h3>
          <ContactNameForm
            firstName={contact.firstName}
            lastName={contact.lastName}
            handleChange={handleChange}
          />
          <ContactInfoForm
            email={contact.email}
            username={contact.username}
            handleChange={handleChange}
          />
          <SaveButton />
        </form>
      </div>

      <style>{`
        @media (min-width: 765px) {
          .p-4 {
            min-width: 100vw; /* Increase width for tablets by 1.4x */
          }
        }
      `}</style>
    </div>
  );
};

export default NewContact;
