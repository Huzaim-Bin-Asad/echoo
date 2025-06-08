import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ← import useNavigate
import axios from "axios";
import ContactNameForm from './ContactNameForm';
import ContactInfoForm from './ContactInfoForm';
import SaveButton from './SaveButton';

const API_BASE_URL = "https://echoo-backend.vercel.app";

const ContactForm = () => {
  const navigate = useNavigate(); // ← initialize navigate
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setContact((prev) => ({
        ...prev,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
      }));
    } else {
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && value) {
      checkEmail(value);
    } else if (name === "username" && value) {
      checkUsername(value);
    }
  };

  const checkEmail = async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/check-email`, { email });
      if (response.data.username) {
        setContact((prev) => ({ ...prev, username: response.data.username }));
      }
    } catch (err) {
      console.error("❌ Error checking email", err);
    }
  };

  const checkUsername = async (username) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/check-username`, { username });
      if (response.data.email) {
        setContact((prev) => ({ ...prev, email: response.data.email }));
      }
    } catch (err) {
      console.error("❌ Error checking username", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 handleSubmit: Form submitted");

    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
    console.log("👀 handleSubmit: Retrieved user ID:", userId);

    if (!userId) {
      console.log("❌ handleSubmit: User ID not found, cannot submit contact.");
      return;
    }

    const contactData = {
      user_id: userId,
      contact_name: `${contact.firstName} ${contact.lastName}`,
      contact_message: null,
      contacted_email: contact.email,
      contacted_username: contact.username,
      created_at: new Date().toISOString(),
    };

    try {
      console.log("📤 handleSubmit: Sending contact data to backend:", contactData);
      const response = await axios.post(`${API_BASE_URL}/api/add-contact`, contactData);
      console.log("✅ handleSubmit: Contact saved successfully:", response.data);
      
      // 👇 redirect after successful save
      navigate("/echoo");
      
    } catch (err) {
      console.error("❌ handleSubmit: Error saving contact", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
};

export default ContactForm;
