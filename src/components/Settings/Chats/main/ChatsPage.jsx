import React from "react";
import Header from "./Header";
import DisplaySection from "./DisplaySection";
import ChatSettingsSection from "./ChatSettingsSection";
import ArchivedSection from "./ArchivedSection";
import ChatGeneralSection from "./ChatGeneralSection";

const ChatsPage = ({ goBack }) => {
  return (
    <div className="container mt-3">
      <Header goBack={goBack} />
      <DisplaySection />
      <ChatSettingsSection />
      <ArchivedSection />
      <ChatGeneralSection />
    </div>
  );
};

export default ChatsPage;
