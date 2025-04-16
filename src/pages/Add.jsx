import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../components/Add/Header";
import ActionItem from "../components/Add/ActionItem";
import ContactList, { contacts } from "../components/Add/ContactList";
import SlideWrapper from "../components/Add/SlideWrapper";

const Add = () => {
  const navigate = useNavigate();  // Initialize useNavigate hook

  // Memoize handleQRCodeClick using useCallback
  const handleQRCodeClick = useCallback(() => {
    navigate('/qr-quicklink');  // Navigate to /qr-quicklink page
  }, [navigate]); // Dependency on navigate

  // Effect to add an event listener for the QR Code icon click (using ID)
  useEffect(() => {
    const qrCodeIcon = document.getElementById('qr-code-icon');
    if (qrCodeIcon) {
      qrCodeIcon.addEventListener('click', handleQRCodeClick);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (qrCodeIcon) {
        qrCodeIcon.removeEventListener('click', handleQRCodeClick);
      }
    };
  }, [handleQRCodeClick]); // Add handleQRCodeClick as a dependency

  return (
    <SlideWrapper>
      <div className="bg-dark text-white d-flex flex-column vh-100">
        <Header contactCount={contacts.length} />

        <div className="flex-grow-1 overflow-auto">
          <div className="px-3 pt-2">
            <ActionItem 
              icon="group" 
              label="New group" 
              onClick={() => navigate('/new-group')}  // Navigate to New Group page
            />
            <ActionItem 
              icon="contact" 
              label="New contact" 
              onClick={() => navigate('/new-contact')}  // Navigate to New Contact page
            />
            <ActionItem 
              icon="qr" 
              label="QR Code" 
              onClick={handleQRCodeClick}  // Directly use the QR click handler
            />
          </div>

          <ContactList />
        </div>
      </div>
    </SlideWrapper>
  );
};

export default Add;
