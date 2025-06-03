import React, { useEffect, useState, useRef } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const blobUrlCache = new Map(); // In-memory cache for object URLs

// New function to fetch readers and likers of this status from server (without cache check)
const fetchReadersFromServer = async (statusId) => {
  try {
    const response = await fetch(
      "https://echoo-backend.vercel.app/api/readers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statusId }),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch readers/likers");

    const data = await response.json();

    // Log the full data received
    console.log("📥 Fetched from server:", data);

    return {
      readers: data.readers || [],
      likers: data.likers || [],
    };
  } catch (err) {
    console.error("❌ Error fetching readers/likers:", err);
    return { readers: [], likers: [] };
  }
};

// Function to update cached readers/likers for a statusId only if new data arrived
const updateReadersCacheIfNew = (statusId, newReaders, newLikers) => {
  const cacheKey = "StatusViewers";
  const rawCache = localStorage.getItem(cacheKey);
  const cache = rawCache ? JSON.parse(rawCache) : {};

  const existing = cache[statusId] || { readers: [], likers: [] };

  const existingStr = JSON.stringify(existing);
  const newStr = JSON.stringify({ readers: newReaders, likers: newLikers });

  if (existingStr !== newStr) {
    cache[statusId] = { readers: newReaders, likers: newLikers };
    localStorage.setItem(cacheKey, JSON.stringify(cache));
    console.log("🔄 Updated cache for statusId:", statusId);
    console.log("👁️ Readers:", newReaders);
    console.log("❤️ Likers:", newLikers);
    return true;
  }

  return false;
};

// New function to mark status as read on backend
const markStatusAsRead = async (userId, statusId) => {
  try {
    const response = await fetch("https://echoo-backend.vercel.app/api/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, statusId }),
    });
    if (!response.ok) {
      throw new Error("Failed to mark status as read");
    }
    console.log("✅ Marked status as read on backend");
  } catch (err) {
    console.error("❌ Error marking status as read:", err);
  }
};

const StatusImage = ({
  media_url,
  statusId,
  onLoad,
  onDuration,
  onPlayStart,
}) => {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;
    let objectUrl = null;
    let shouldRevoke = false;

    setLoaded(false);
    setMediaSrc(null);
    setMediaType(null);
    setIsPlaying(false);
    setMuted(true);

    const loadMedia = async () => {
      if (!media_url) return;

      if (media_url.startsWith("data:image")) {
        setMediaType("image");
        setMediaSrc(media_url);
        if (onDuration) {
          onDuration(5000, "image");
        }
        return;
      }

      if (blobUrlCache.has(media_url)) {
        const { url, type } = blobUrlCache.get(media_url);
        setMediaType(type);
        setMediaSrc(url);
        if (type === "image" && onDuration) {
          onDuration(5000, "image");
        }
        return;
      }

      try {
        const response = await fetch(media_url);
        if (!response.ok) throw new Error("Failed to load media");

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        const mime = blob.type;
        const type =
          mime.startsWith("video") || mime === "application/mp4"
            ? "video"
            : "image";

        blobUrlCache.set(media_url, { url: objectUrl, type });
        shouldRevoke = false;

        if (!isCancelled) {
          setMediaType(type);
          setMediaSrc(objectUrl);
          if (type === "image" && onDuration) {
            onDuration(5000, "image");
          }
        }
      } catch (err) {
        console.error("❌ Error loading media:", err);
      }
    };

    loadMedia();

    return () => {
      isCancelled = true;
      if (objectUrl && shouldRevoke) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [media_url]);

  // Polling readers every 500ms to update cache if new readers
  useEffect(() => {
    if (!statusId) return;

    let isMounted = true;

    const pollReaders = async () => {
      if (!isMounted) return;

      try {
        const newReaders = await fetchReadersFromServer(statusId);
        const updated = updateReadersCacheIfNew(statusId, newReaders);
        if (updated) {
          console.log("📦 Cache updated with new readers");
          // Optionally: you can trigger some state update here or callback to parent
        }
      } catch (e) {
        console.error("❌ Polling error:", e);
      }
    };

    // Initial call immediately
    pollReaders();

    // Setup interval
    pollingIntervalRef.current = setInterval(pollReaders, 500);

    return () => {
      isMounted = false;
      clearInterval(pollingIntervalRef.current);
    };
  }, [statusId]);

  // Updated handleLoad to mark status as read
  const handleLoad = async () => {
    setLoaded(true);
    if (onLoad) onLoad();

    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        if (userObj?.user_id && statusId) {
          await markStatusAsRead(userObj.user_id, statusId);

          // Fetch readers after marking read (optional because polling is running)
          // const readers = await fetchReadersFromServer(statusId);
          // updateReadersCacheIfNew(statusId, readers);
        }
      } catch (e) {
        console.error("❌ Failed to parse user from localStorage", e);
      }
    }
  };

  const handleLoadedData = (event) => {
    const duration = event.target?.duration;
    if (onDuration && duration) {
      const durationMs = duration * 1000;
      onDuration(durationMs, "video");
    }
    handleLoad();
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    setMuted(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
    if (onPlayStart) {
      onPlayStart();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !muted;
    setMuted(newMuted);
    videoRef.current.muted = newMuted;
  };

  return (
    <div
      className="d-flex justify-content-end align-items-end position-relative mx-auto"
      style={{
        maxWidth: "95vw",
        maxHeight: "80vh",
        height: mediaType === "video" ? "60vh" : "60vh",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#000",
        transform: "translateY(80px)",
      }}
    >
      {!loaded && (
        <div className="text-light position-absolute top-50 start-50 translate-middle">
          Loading media...
        </div>
      )}

      {/* Image */}
      {mediaType === "image" && mediaSrc && (
        <img
          src={mediaSrc}
          alt="Status"
          onLoad={handleLoad}
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            borderRadius: "12px",
            display: loaded ? "block" : "none",
            userSelect: "none",
          }}
        />
      )}

      {/* Video */}
      {mediaType === "video" && mediaSrc && (
        <>
          <video
            ref={videoRef}
            src={mediaSrc}
            muted={muted}
            playsInline
            onLoadedData={handleLoadedData}
            className="w-100 h-100"
            style={{
              objectFit: "cover",
              borderRadius: "12px",
              display: loaded ? "block" : "none",
              userSelect: "none",
            }}
            autoPlay={isPlaying}
            controls={false}
          />

          {!isPlaying && loaded && (
            <button
              onClick={handlePlayClick}
              aria-label="Play video"
              className="btn btn-dark position-absolute top-50 start-50 translate-middle rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "46px",
                height: "46px",
                backgroundColor: "rgba(0,0,0,0.6)",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <Play color="white" size={27} />
            </button>
          )}

          {isPlaying && loaded && (
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="btn btn-dark position-absolute top-0 start-0 m-2 rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(0,0,0,0.6)",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              {muted ? (
                <VolumeX color="white" size={20} />
              ) : (
                <Volume2 color="white" size={20} />
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default StatusImage;
