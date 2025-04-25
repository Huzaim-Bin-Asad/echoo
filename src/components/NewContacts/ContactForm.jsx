import React, { useState, useEffect } from "react";
import axios from "axios";
import ContactNameForm from './ContactNameForm';
import ContactInfoForm from './ContactInfoForm';
import SaveButton from './SaveButton';

const API_BASE_URL = "http://localhost:5000"; // <-- Set your backend base URL

const ContactForm = () => {
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    console.log("👀 useEffect: Checking if user data exists in localStorage.");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      console.log("✅ User data found in localStorage:", userData);
      setContact((prev) => ({
        ...prev,
        firstName: userData.firstName,
        lastName: userData.lastName,
      }));
    } else {
      console.log("❌ No user data found in localStorage.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 handleChange: Updating field - ${name} with value - ${value}`);
    setContact({ ...contact, [name]: value });

    if (name === "email" && value) {
      console.log(`🔍 Checking email: ${value}`);
      checkEmail(value);
    } else if (name === "username" && value) {
      console.log(`🔍 Checking username: ${value}`);
      checkUsername(value);
    }
  };

  const checkEmail = (email) => {
    console.log(`📧 checkEmail: Sending request to check email - ${email}`);
    axios.post(`${API_BASE_URL}/api/check-email`, { email })
      .then(response => {
        console.log("✅ checkEmail response received:", response.data);
        if (response.data.username) {
          console.log("👤 Found username for email:", response.data.username);
          setContact((prev) => ({ ...prev, username: response.data.username }));
        }
      })
      .catch(err => {
        console.error("❌ Error checking email", err);
      });
  };

  const checkUsername = (username) => {
    console.log(`👤 checkUsername: Sending request to check username - ${username}`);
    axios.post(`${API_BASE_URL}/api/check-username`, { username })
      .then(response => {
        console.log("✅ checkUsername response received:", response.data);
        if (response.data.email) {
          console.log("📧 Found email for username:", response.data.email);
          setContact((prev) => ({ ...prev, email: response.data.email }));
        }
      })
      .catch(err => {
        console.error("❌ Error checking username", err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📝 handleSubmit: Form submitted");

    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
    console.log("👀 handleSubmit: Retrieved user ID:", userId);

    if (userId) {
      const contactData = {
        user_id: userId,
        contact_name: `${contact.firstName} ${contact.lastName}`,
        contact_message: null,  // Optional: Modify if needed
        created_at: new Date().toISOString(),
      };

      console.log("📤 handleSubmit: Sending contact data to backend:", contactData);
      axios.post(`${API_BASE_URL}/add-contact`, contactData)
        .then(response => {
          console.log("✅ handleSubmit: Contact saved successfully:", response.data);
        })
        .catch(err => {
          console.error("❌ handleSubmit: Error saving contact", err);
        });
    } else {
      console.log("❌ handleSubmit: User ID not found, cannot submit contact.");
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
