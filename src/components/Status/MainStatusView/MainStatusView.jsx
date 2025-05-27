import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import StatusImage from "./StatusImage";

const StatusView = ({
  onBack,
  userId,
  blobUrl,
  contactName,
  statuses,
  latestStatus,
  mediaItems,
  statusIds,
}) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [subtitle, setSubtitle] = useState("");
  const [startProgress, setStartProgress] = useState(false);
  const [mediaType, setMediaType] = useState(null);
  const [mediaDuration, setMediaDuration] = useState(5000);
  const [videoStarted, setVideoStarted] = useState(false);
  const [statusObject, setStatusObject] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!userId) return;

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

    const formatAndSetSubtitle = (timestamp) => {
      const formatted = new Date(timestamp).toLocaleString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      });
      setSubtitle(formatted);
      console.log("🕒 Subtitle set with timestamp:", formatted);
    };

    if (blobUrl && statuses?.length) {
      const timestamp = latestStatus?.timestamp || Date.now();
      formatAndSetSubtitle(timestamp);

      setStatusObject({
        contactName: contactName || "Me",
        statuses: statuses,
      });

      setCurrentIndex(0);
      setStartProgress(false);
      setMediaType(null);
      setMediaDuration(5000);
      setVideoStarted(false);
      return;
    }

    if ((!blobUrl || blobUrl === "") && mediaItems?.length && statuses?.length) {
      const sortedStatuses = [...statuses].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      const sortedMediaItems = [...mediaItems].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      const combinedStatuses = sortedStatuses.map((status, idx) => {
        const mediaItem = sortedMediaItems[idx];
        return {
          ...status,
          media_url: mediaItem?.blobUrl || status.media_url_original || "",
          duration: mediaItem?.duration || 5000,
        };
      });

      const latestTimestamp =
        latestStatus?.timestamp ||
        sortedStatuses[sortedStatuses.length - 1]?.timestamp ||
        Date.now();
      formatAndSetSubtitle(latestTimestamp);

      setStatusObject({
        contactName: contactName || sortedStatuses[0]?.contactName || "Me",
        statuses: combinedStatuses,
      });

      setCurrentIndex(0);
      setStartProgress(false);
      setMediaType(null);
      setMediaDuration(5000);
      setVideoStarted(false);
      return;
    }

    if (blobUrl) {
      const timestamp = latestStatus?.timestamp || Date.now();
      formatAndSetSubtitle(timestamp);

      setStatusObject({
        contactName: contactName || "Me",
        statuses: [
          {
            media_url: blobUrl,
            timestamp,
          },
        ],
      });

      setCurrentIndex(0);
      setStartProgress(false);
      setMediaType(null);
      setMediaDuration(5000);
      setVideoStarted(false);
    }
  }, [userId, blobUrl, contactName, statuses, latestStatus, mediaItems]);

  const handleImageLoad = () => {
    console.log("Image loaded, starting progress.");
    setStartProgress(true);
  };

  const handleProgressComplete = (status) => {
    if (status !== "mediaComplete") return;
    if (!statusObject || !Array.isArray(statusObject.statuses)) {
      console.warn("StatusView: No statusObject or statuses found.");
      onBack();
      return;
    }

    const totalStatuses = statusObject.statuses.length;
    console.log("Progress complete. Current index:", currentIndex, "Total statuses:", totalStatuses);

    if (totalStatuses <= 1) {
      console.log("Only one or no media item, calling onBack.");
      onBack();
    } else {
      if (currentIndex < totalStatuses - 1) {
        console.log("Moving to next media.");
        setCurrentIndex((prev) => prev + 1);
        setStartProgress(false);
        setMediaType(null);
        setMediaDuration(5000);
        setVideoStarted(false);
      } else {
        console.log("Last media finished, calling onBack.");
        onBack();
      }
    }
  };

  const handleMediaInfo = (durationMs, type) => {
    console.log(`Media info received: duration=${durationMs}ms, type=${type}`);
    setMediaDuration(durationMs);
    setMediaType(type);
  };

  const handlePlayStart = () => {
    console.log("Video started playing.");
    setVideoStarted(true);
    setStartProgress(true);
  };

  const currentMedia = statusObject?.statuses?.[currentIndex];

  if (!userId || !statusObject || !currentMedia) {
    return (
      <div className="d-flex flex-column vh-100 bg-black text-white">
        <Header onBack={onBack} />
        <div className="text-center my-auto">Missing userId or media</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100 bg-black text-white p-3">
      <Header
        onBack={onBack}
        title={`${statusObject.contactName} (Status)`}
        subtitle={subtitle}
        profileImageUrl={profilePicture}
        progressIndex={currentIndex}
        total={statusObject.statuses.length}
        startProgress={startProgress}
        onProgressComplete={handleProgressComplete}
        mediaType={mediaType}
        mediaDuration={mediaDuration}
        videoStarted={videoStarted}
      />

      <div style={{ flexGrow: 1 }}>
        <StatusImage
          key={currentMedia.media_url}
          media_url={currentMedia.media_url}
          onLoad={handleImageLoad}
          onDuration={handleMediaInfo}
          onPlayStart={handlePlayStart}
        />
      </div>

      <Footer />
    </div>
  );
};

export default StatusView;
