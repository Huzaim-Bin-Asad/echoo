// StatusView.jsx
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import StatusImage from "./StatusImage";

const StatusView = ({
  statuses,
  loading,
  onBack,
  currentStatus,
  userId,
  mediaUrls,
}) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subtitle, setSubtitle] = useState("");
  const [startProgress, setStartProgress] = useState(false); // controls progress start

  useEffect(() => {
    if (currentStatus && userId) {
      const fetchProfilePicture = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/profile-picture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          if (!response.ok) throw new Error("Failed to fetch profile picture");

          const data = await response.json();
          setProfilePicture(data.profilePicture);
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      };

      fetchProfilePicture();

      const oldest = [...(currentStatus.statuses || [])].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      )[0];

      const formatted = new Date(oldest.timestamp).toLocaleString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      });
      setSubtitle(formatted);
    }
  }, [currentStatus, userId]);

  // Reset on new status
  useEffect(() => {
    setCurrentIndex(0);
    setStartProgress(false);
  }, [currentStatus]);

  const allStatusesSorted = [...(currentStatus?.statuses || [])].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  const currentMedia = allStatusesSorted[currentIndex];

  // Called when image is loaded to start progress
  const handleImageLoad = () => {
    setStartProgress(true);
  };

  // Called when progress completes in Header
  const handleProgressComplete = (info) => {
    if (currentIndex < allStatusesSorted.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStartProgress(false); // reset progress for next status
    } else {
      onBack(); // Close when last status completes
    }
  };

  if (loading || !currentStatus) {
    return (
      <div className="d-flex flex-column vh-100 bg-black text-white">
        <Header onBack={onBack} />
        <div className="text-center my-auto">
          {loading ? "Loading statuses..." : "No status selected"}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100 bg-black text-white p-3">
      <Header
        onBack={onBack}
        title={currentStatus.contactName}
        subtitle={subtitle}
        profileImageUrl={profilePicture}
        progressIndex={currentIndex}
        total={allStatusesSorted.length}
        startProgress={startProgress}
        onProgressComplete={handleProgressComplete}
      />

      <div style={{ flexGrow: 1 }}>
        <StatusImage media_url={currentMedia.media_url} onLoad={handleImageLoad} />
      </div>

      <Footer />
    </div>
  );
};

export default StatusView;
