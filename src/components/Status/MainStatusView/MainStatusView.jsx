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

  // Auto-cycle and auto-close
  useEffect(() => {
    if (!currentStatus?.statuses || currentStatus.statuses.length === 0) return;

    const statuses = [...currentStatus.statuses].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < statuses.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(timer);
          onBack(); // Close StatusView
          return prevIndex;
        }
      });
    }, 5000); // 5 seconds per status

    return () => clearInterval(timer);
  }, [currentStatus, onBack]);

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

  const allStatusesSorted = [...currentStatus.statuses].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  const currentMedia = allStatusesSorted[currentIndex];

  return (
    <div className="d-flex flex-column vh-100 bg-black text-white p-3">
      <Header
        onBack={onBack}
        title={currentStatus.contactName}
        subtitle={subtitle}
        profileImageUrl={profilePicture}
        progressIndex={currentIndex}
        total={allStatusesSorted.length}
      />

      <div style={{ flexGrow: 1 }}>
        <StatusImage media_url={currentMedia.media_url} />
      </div>

      <Footer />
    </div>
  );
};

export default StatusView;
