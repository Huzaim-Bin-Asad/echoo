import React, { useEffect, useState } from "react";

const blobUrlCache = new Map(); // In-memory cache for object URLs

const StatusImage = ({ media_url, onLoad }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let objectUrl = null;
    let shouldRevoke = false;

    setLoaded(false);
    setImageSrc(null);

    const loadImage = async () => {
      if (!media_url) return;

      if (media_url.startsWith("data:image")) {
        setImageSrc(media_url);
        return;
      }

      if (blobUrlCache.has(media_url)) {
        setImageSrc(blobUrlCache.get(media_url));
        return;
      }

      try {
        const response = await fetch(media_url);
        if (!response.ok) throw new Error("Failed to load media");

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        blobUrlCache.set(media_url, objectUrl);
        shouldRevoke = false;

        if (!isCancelled) {
          setImageSrc(objectUrl);
        }
      } catch (err) {
        console.error("Error loading image:", err);
      }
    };

    loadImage();

    return () => {
      isCancelled = true;
      if (objectUrl && shouldRevoke) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [media_url]);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        flexGrow: 1,
        height: "100%",           // Full container height to center vertically
        width: "100%",            // Full width to allow responsive scaling
        overflow: "hidden",       // Hide overflow if image is larger than container
      }}
    >
      {!loaded && <div className="text-muted">Loading image...</div>}

      {imageSrc && (
        <img
          src={imageSrc}
          alt="Status"
          onLoad={handleLoad}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: loaded ? "block" : "none",
            borderRadius: "8px",
            margin: "auto",       // horizontally center if smaller than container
          }}
        />
      )}
    </div>
  );
};

export default StatusImage;
