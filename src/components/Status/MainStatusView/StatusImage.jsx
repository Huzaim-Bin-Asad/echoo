import React, { useEffect, useState, useRef } from "react";
import { Play } from "lucide-react";

const blobUrlCache = new Map(); // In-memory cache for object URLs

const StatusImage = ({ media_url, onLoad, onDuration, onPlayStart }) => {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;
    let objectUrl = null;
    let shouldRevoke = false;

    setLoaded(false);
    setMediaSrc(null);
    setMediaType(null);
    setIsPlaying(false);

    const loadMedia = async () => {
      if (!media_url) return;

      console.log("📥 Loading media:", media_url);

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

        const type = blob.type.startsWith("video") ? "video" : "image";
        console.log(`🧠 Media type detected: ${type}`);

        blobUrlCache.set(media_url, { url: objectUrl, type });
        shouldRevoke = false;

        if (!isCancelled) {
          setMediaType(type);
          setMediaSrc(objectUrl);
          if (type === "image" && onDuration) {
            console.log("🧾 Forwarding image type with default duration (5000ms)");
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

  const handleLoad = () => {
    setLoaded(true);
    console.log("✅ Media loaded.");
    if (onLoad) onLoad();
  };

  const handleLoadedData = (event) => {
    handleLoad();
    const duration = event.target?.duration;
    if (onDuration && duration) {
      const durationMs = duration * 1000;
      console.log("⏱ Video duration detected (ms):", durationMs);
      onDuration(durationMs, "video");
    }
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
      console.log("▶️ Video playback started.");
    }
    if (onPlayStart) {
      onPlayStart(); // notify parent video started
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center position-relative"
      style={{
        flexGrow: 1,
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {!loaded && <div className="text-muted">Loading media...</div>}

      {mediaType === "image" && mediaSrc && (
        <img
          src={mediaSrc}
          alt="Status"
          onLoad={handleLoad}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: loaded ? "block" : "none",
            borderRadius: "8px",
          }}
        />
      )}

      {mediaType === "video" && mediaSrc && (
        <>
          <video
            ref={videoRef}
            src={mediaSrc}
            muted
            playsInline
            onLoadedData={handleLoadedData}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "8px",
              display: loaded ? "block" : "none",
            }}
            autoPlay={isPlaying}
            controls={isPlaying}
          />
          {!isPlaying && loaded && (
            <button
              onClick={handlePlayClick}
              aria-label="Play video"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0,0,0,0.6)",
                border: "none",
                borderRadius: "50%",
                padding: "16px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Play color="white" size={32} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default StatusImage;
