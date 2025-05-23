import React, { useEffect, useState } from "react";

const blobUrlCache = new Map(); // In-memory cache for object URLs

const StatusImage = ({ media_url, onLoad }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let objectUrl = null;
    let shouldRevoke = false; // track if we should revoke blob URL on cleanup

    setLoaded(false);
    setImageSrc(null);

    const loadImage = async () => {
      if (!media_url) return;

      // If it's base64 (thumbnail), use directly
      if (media_url.startsWith("data:image")) {
        setImageSrc(media_url);
        return;
      }

      // Use cached blob URL if available
      if (blobUrlCache.has(media_url)) {
        setImageSrc(blobUrlCache.get(media_url));
        return;
      }

      try {
        const response = await fetch(media_url);
        if (!response.ok) throw new Error("Failed to load media");

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        // Cache the blob URL for future use
        blobUrlCache.set(media_url, objectUrl);
        shouldRevoke = false; // because cached, don't revoke on cleanup

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

      // Revoke the blob URL only if it was created here AND NOT cached
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
      style={{ flexGrow: 1 }}
    >
      {!loaded && <div className="text-muted">Loading image...</div>}

      {imageSrc && (
        <img
          src={imageSrc}
          alt="Status"
          onLoad={handleLoad}
          style={{
            maxWidth: "90vw",
            maxHeight: "80vh",
            objectFit: "contain",
            display: loaded ? "block" : "none",
            borderRadius: "8px",
          }}
        />
      )}
    </div>
  );
};

export default StatusImage;
