import React from "react";
import StickyHeader from "./StickyHeader";
import UserDetails from "./UserDetails";
import ContactedUserAbout from "./ContactedUserAbout";
import MediaLinksDocs from "./MediaLinksDocs";
import ChatOptions from "./ChatOptions";
import GroupsInCommon from "./GroupsInCommon";
import UserBasedPreferences from "./UserBasedPreferences";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ContactedUserProfileDetails = ({ onBack }) => {
  return (
    <div
      className="text-dark"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "150vh",
      }}
    >
      {/* Sticky header receives onBack from parent and calls it */}
      <StickyHeader onBack={() => onBack?.({ from: "ContactedUserProfileData" })} />

      {/* Scrollable profile content */}
      <div className="px-3 pt-2 pb-3">
        <UserDetails />
        <ContactedUserAbout />
        <MediaLinksDocs />
        <ChatOptions />
        <GroupsInCommon />
        <UserBasedPreferences />
      </div>
    </div>
  );
};

export default ContactedUserProfileDetails;
