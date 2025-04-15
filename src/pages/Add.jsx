import React from "react";
import Header from "../components/Add/Header";
import ActionItem from "../components/Add/ActionItem";
import ContactList, { contacts } from "../components/Add/ContactList";
import SlideWrapper from "../components/Add/SlideWrapper";

const Add = () => {
  return (
    <SlideWrapper>
      <div className="bg-dark text-white d-flex flex-column vh-100">
        <Header contactCount={contacts.length} />

        <div className="flex-grow-1 overflow-auto">
          <div className="px-3 pt-2">
            <ActionItem icon="group" label="New group" />
            <ActionItem icon="contact" label="New contact" />
          </div>

          <ContactList />
        </div>
      </div>
    </SlideWrapper>
  );
};

export default Add;
