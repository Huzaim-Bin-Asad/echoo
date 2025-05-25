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
  blobUrl,
  fromMyStatusView,
}) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subtitle, setSubtitle] = useState("");
  const [startProgress, setStartProgress] = useState(false);
  const [myStatusObject, setMyStatusObject] = useState(null);

  // Track media type and duration from StatusImage
  const [mediaType, setMediaType] = useState(null);
  const [mediaDuration, setMediaDuration] = useState(5000); // default 5s
  const [videoStarted, setVideoStarted] = useState(false);

  useEffect(() => {
    if (!currentStatus || !userId) return;

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
        console.error("❌ Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();

    const oldest = [...(currentStatus.statuses || [])].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    )[0];

    if (oldest?.timestamp) {
      const formatted = new Date(oldest.timestamp).toLocaleString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      });
      setSubtitle(formatted);
    }

    if (fromMyStatusView && blobUrl) {
      setMyStatusObject({
        statuses: [
          {
            media_url: blobUrl,
            timestamp: Date.now(),
          },
        ],
        contactName: "You",
      });
    }
  }, [currentStatus, userId, blobUrl, fromMyStatusView]);

  useEffect(() => {
    setCurrentIndex(0);
    setStartProgress(false);
    setMediaType(null);
    setMediaDuration(5000);
    setVideoStarted(false);
  }, [currentStatus, blobUrl]);

  const actualStatusObj = fromMyStatusView && blobUrl ? myStatusObject : currentStatus;

  const allStatusesSorted = [...(actualStatusObj?.statuses || [])].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const currentMedia = allStatusesSorted[currentIndex];

  const handleImageLoad = () => {
    setStartProgress(true);
  };

  const handleProgressComplete = () => {
    if (currentIndex < allStatusesSorted.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStartProgress(false);
      setVideoStarted(false);
    } else {
      onBack();
    }
  };

  const handleMediaInfo = (durationMs, type) => {
    console.log("⏳ Duration from StatusImage:", durationMs, "🧾 Type:", type);
    setMediaDuration(durationMs);
    setMediaType(type);
  };

  const handlePlayStart = () => {
    setVideoStarted(true);
    setStartProgress(true);
  };

  if (loading || !actualStatusObj || !currentMedia) {
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
        title={
          fromMyStatusView
            ? `${actualStatusObj.contactName} (My Status)`
            : actualStatusObj.contactName
        }
        subtitle={subtitle}
        profileImageUrl={profilePicture}
        progressIndex={currentIndex}
        total={allStatusesSorted.length}
        startProgress={startProgress}
        onProgressComplete={handleProgressComplete}
        mediaType={mediaType}
        mediaDuration={mediaDuration}
        videoStarted={videoStarted}
      />

      <div style={{ flexGrow: 1 }}>
<StatusImage
  media_url={currentMedia.media_url}
  onLoad={handleImageLoad}
  onDuration={handleMediaInfo}  // <-- change here to match StatusImage's expected prop
  onPlayStart={handlePlayStart}
/>

      </div>

      <Footer />
    </div>
  );
};

export default StatusView;
