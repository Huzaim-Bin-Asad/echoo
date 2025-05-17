 let intervalId = null;
const CACHE_KEY = 'myStatusCache';
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory cache for thumbnails keyed by media URL
const thumbnailCache = {};

export const startCurrentStatusFetcher = (setStatusPreview) => {
  if (intervalId !== null) {
    console.log('[Fetcher] Already running');
    return;
  }

  let lastBlobUrl = null;
  let lastStatusTimestamp = null;

  // Load cached status from localStorage if not expired
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > EXPIRY_MS;

      if (isExpired) {
        console.log('[Fetcher] Cached status expired — clearing');
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
        thumbnailCache[lastBlobUrl] = parsed.thumbnail;
        console.log('[Fetcher] Loaded status from cache');
      }
    } catch (e) {
      console.warn('[Fetcher] Error parsing cached status — clearing');
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
      console.error('[Fetcher] Invalid user JSON');
      return;
    }

    const userId = user.user_id;
    if (!userId) return;

    try {
      const response = await fetch('http://localhost:5000/api/getCurrentStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) return;

      const mediaBlob = await response.blob();
      const timestampHeader = response.headers.get('x-status-timestamp');
      const serverTimestamp = Number(timestampHeader);

      if (!serverTimestamp) {
        console.warn('[Fetcher] Missing or invalid timestamp header, ignoring update');
        return;
      }

      // Skip update if status unchanged
      if (serverTimestamp === lastStatusTimestamp) return;

      lastStatusTimestamp = serverTimestamp;

      // Revoke old URL to free memory
      if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
      lastBlobUrl = URL.createObjectURL(mediaBlob);

      // Use cached thumbnail if available
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

        setStatusPreview({
          mediaUrl: lastBlobUrl,
          thumbnail,
          type: mediaBlob.type,
          timestamp: serverTimestamp,
        });

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            mediaUrl: lastBlobUrl,
            thumbnail,
            type: mediaBlob.type,
            timestamp: serverTimestamp,
          })
        );
      });
    } catch (err) {
      console.error('[Fetcher] Error:', err);
    }
  }

  fetchAndCacheStatus();
  intervalId = setInterval(fetchAndCacheStatus, 1000);
  console.log('[Fetcher] Started interval');
};

export const stopCurrentStatusFetcher = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[Fetcher] Stopped interval');
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
    console.warn('[Fetcher] Failed to load image for thumbnail');
    callback(null);
  };
};