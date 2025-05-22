let intervalId = null;
const CACHE_KEY = 'myStatusCache';
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory cache for thumbnails keyed by blob URL
const thumbnailCache = {};

export const startCurrentStatusFetcher = (setStatusPreview) => {
  if (intervalId !== null) {
    return;
  }

  let lastBlobUrl = null;
  let lastStatusTimestamp = null;
  let lastOriginalMediaUrl = null;

  // Load cached status from localStorage if not expired
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > EXPIRY_MS;

      if (isExpired) {
        localStorage.removeItem(CACHE_KEY);
      } else {
        setStatusPreview({
          mediaUrl: parsed.mediaUrl,
          thumbnail: parsed.thumbnail,
          type: parsed.type,
          timestamp: parsed.timestamp,
        });
        lastStatusTimestamp = parsed.timestamp;
        lastBlobUrl = parsed.mediaUrl;
        lastOriginalMediaUrl = parsed.originalMediaUrl;
        thumbnailCache[lastBlobUrl] = parsed.thumbnail;
      }
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  async function fetchAndCacheStatus() {
    const raw = localStorage.getItem('user');
    if (!raw) return;

    let user;
    try {
      user = JSON.parse(raw);
    } catch {
      return;
    }

    const userId = user.user_id;
    if (!userId) return;

    try {
      const response = await fetch('http://localhost:5000/api/getCurrentStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          originalMediaUrl: lastOriginalMediaUrl || null,
          isCached: !!lastOriginalMediaUrl,
        }),
      });

      if (response.status === 204) {
        // Backend says cached media is current — do nothing, keep current preview
        return;
      }

      if (response.status === 404) {
        setStatusPreview(null);
        localStorage.removeItem(CACHE_KEY);

        if (lastBlobUrl) {
          URL.revokeObjectURL(lastBlobUrl);
          lastBlobUrl = null;
        }
        lastStatusTimestamp = null;
        lastOriginalMediaUrl = null;
        return;
      }

      if (!response.ok) {
        return;
      }

      const timestampHeader = response.headers.get('x-status-timestamp');
      const originalMediaUrl = response.headers.get('x-status-mediaurl');
      const serverTimestamp = Number(timestampHeader);

      if (!serverTimestamp || !originalMediaUrl) {
        return;
      }

      // Skip update if same timestamp and media URL
      if (
        serverTimestamp === lastStatusTimestamp &&
        originalMediaUrl === lastOriginalMediaUrl
      ) return;

      lastStatusTimestamp = serverTimestamp;
      lastOriginalMediaUrl = originalMediaUrl;

      const mediaBlob = await response.blob();

      // Revoke old blob URL
      if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
      lastBlobUrl = URL.createObjectURL(mediaBlob);

      if (thumbnailCache[lastBlobUrl]) {
        setStatusPreview({
          mediaUrl: lastBlobUrl,
          thumbnail: thumbnailCache[lastBlobUrl],
          type: mediaBlob.type,
          timestamp: serverTimestamp,
        });
        return;
      }

      generateThumbnail(lastBlobUrl, mediaBlob.type, (thumbnail) => {
        if (!thumbnail) return;

        thumbnailCache[lastBlobUrl] = thumbnail;

        const preview = {
          mediaUrl: lastBlobUrl,
          thumbnail,
          type: mediaBlob.type,
          timestamp: serverTimestamp,
        };

        setStatusPreview(preview);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            ...preview,
            originalMediaUrl, // save MEGA URL in cache ✅
          })
        );
      });
    } catch {
      // silently ignore errors
    }
  }

  fetchAndCacheStatus();
  intervalId = setInterval(fetchAndCacheStatus, 1000);
};

export const stopCurrentStatusFetcher = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// Generates a thumbnail image (base64) for image/video blobs
const generateThumbnail = (src, type, callback) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const maxSize = 150;

    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
    callback(thumbnail);
  };

  img.onerror = () => {
    callback(null);
  };
};
