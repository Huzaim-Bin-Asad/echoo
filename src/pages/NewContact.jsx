import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContactForm from "../components/NewContacts/ContactForm";

const NewContact = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="bg-dark text-white d-flex justify-content-center align-items-center vh-100">
      <div
        className="p-4 rounded shadow-lg w-100"
        style={{
          maxWidth: "600px",
          width: "90vw",
          minHeight: "100vh",
          height: "auto",
          backgroundColor: "#1a1a1a",
          position: "relative",
        }}
      >
        <ChevronLeft
          size={30}
          style={{
            position: "absolute",
            left: "10px",
            top: "20px",
            cursor: "pointer",
            color: "white",
          }}
          onClick={handleBackClick}
        />
        
        <ContactForm />
      </div>
    </div>
  );
};

export default NewContact;