import React, { useEffect, useState, useRef } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const blobUrlCache = new Map(); // In-memory cache for object URLs

const StatusImage = ({ media_url, statusId, onLoad, onDuration, onPlayStart }) => {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  // Log props whenever they change:
  useEffect(() => {
    console.log("📥 StatusImage received props:");
    console.log({ media_url, statusId });  // <-- add statusId here
  }, [media_url,  statusId]);

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
        console.log("🖼 Detected inline image");
        setMediaType("image");
        setMediaSrc(media_url);
        if (onDuration) {
          console.log("🧾 Forwarding image type with default duration (5000ms)");
          onDuration(5000, "image");
        }
        return;
      }

      if (blobUrlCache.has(media_url)) {
        const { url, type } = blobUrlCache.get(media_url);
        console.log("♻️ Using cached media URL:", { url, type });
        setMediaType(type);
        setMediaSrc(url);
        if (type === "image" && onDuration) {
          console.log("🧾 Forwarding cached image type with default duration (5000ms)");
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

  // Also log when callbacks are triggered:
  const handleLoad = () => {
    console.log("✅ Image/video loaded");
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleLoadedData = (event) => {
    const duration = event.target?.duration;
    if (onDuration && duration) {
      const durationMs = duration * 1000;
      console.log("⏱ Video duration detected (ms):", durationMs);
      onDuration(durationMs, "video");
    }
    handleLoad();
  };

  const handlePlayClick = () => {
    console.log("▶️ Play clicked");
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

        transform: "translateY(80px)", // Option B: Shift all content lower
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
            objectFit: "cover", // changed from "contain"
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
              objectFit: "cover", // changed from "contain"
              borderRadius: "12px",
              display: loaded ? "block" : "none",
              userSelect: "none",
            }}
            autoPlay={isPlaying}
            controls={false}
          />

          {/* Play button overlay */}
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

          {/* Volume toggle button top-left */}
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
                <VolumeX color="white" size={24} />
              ) : (
                <Volume2 color="white" size={24} />
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default StatusImage;
