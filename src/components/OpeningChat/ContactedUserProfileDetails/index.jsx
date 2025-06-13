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

const ContactedUserProfileDetails = () => {
  return (
    <div
      className="text-dark"
      style={{
        backgroundColor: "#f8f9fa", // slightly duller white
        minHeight: "150vh",         // ensures scroll space
      }}
    >
      {/* This header sticks at top */}
      <StickyHeader />

      {/* Scrollable profile content */}
      <div className="px-3 pb-5">
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
