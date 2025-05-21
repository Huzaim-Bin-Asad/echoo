import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import StatusImage from "./StatusImage";

const StatusView = ({ statuses, loading, onBack, currentStatus, userId, mediaUrls }) => {
  useEffect(() => {
    if (currentStatus) {
      console.log("Contact Name:", currentStatus.contactName);
      console.log("User ID:", userId);
      console.log("All Statuses:", currentStatus.statuses);
      console.log("Latest Status:", currentStatus.latestStatus);
      console.log("Media URLs:", mediaUrls);
    }
  }, [currentStatus, userId, mediaUrls]);

  if (loading) {
    return (
      <div className="d-flex flex-column vh-100 bg-black text-white">
        <Header onBack={onBack} />
        <div className="text-center my-auto">Loading statuses...</div>
        <Footer />
      </div>
    );
  }

  if (!currentStatus) {
    return (
      <div className="d-flex flex-column vh-100 bg-black text-white">
        <Header onBack={onBack} />
        <div className="text-center my-auto">No status selected</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100 bg-black text-white p-3">
      <Header onBack={onBack} />

      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {/* Just show the latest status image */}
        {currentStatus.latestStatus ? (
          <StatusImage status={currentStatus.latestStatus} />
        ) : (
          <p>No latest status available.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default StatusView;
