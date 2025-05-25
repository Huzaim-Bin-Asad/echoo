import { saveBlobToDB, getBlobFromDB } from './blobUrlDB';

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

let cachedStatuses = null;
let cacheTimestamp = null;
let pollingIntervalId = null;
let pollingCallback = null;

const getFixedTime = () => new Date().toISOString();


const ensureBlobUrl = async (status) => {
  if (status.blobUrl) return status; // already has blobUrl

  if (!status.original_media_url) return { ...status, blobUrl: null, blobKey: null };

  try {
    const dbBlob = await getBlobFromDB(status.status_id);
    if (dbBlob) {
      const blobUrl = URL.createObjectURL(dbBlob);
      window.myBlobUrl = blobUrl; // for debugging
      return { ...status, blobUrl, blobKey: status.status_id };
    }

    // Fetch media from backend and save
    const mediaRes = await fetch('http://localhost:5000/api/getMediaByUrl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media_url: status.original_media_url }),
    });

    if (!mediaRes.ok) {
      console.warn(`[Blob Check] Failed fetch media blob for status_id=${status.status_id}`);
      return { ...status, blobUrl: null, blobKey: null };
    }

    const mediaBlob = await mediaRes.blob();
    await saveBlobToDB(status.status_id, mediaBlob);
    const blobUrl = URL.createObjectURL(mediaBlob);

    // Update cache with blobKey, not blobUrl
    if (cachedStatuses) {
      cachedStatuses = cachedStatuses.map(s =>
        s.status_id === status.status_id ? { ...s, blobUrl, blobKey: status.status_id } : s
      );
    }

    return { ...status, blobUrl, blobKey: status.status_id };
  } catch (err) {
    console.error(`[Blob Check] Error processing blob for status_id=${status.status_id}`, err);
    return { ...status, blobUrl: null, blobKey: null };
  }
};

// Initialize cache from localStorage
try {
  const savedCache = localStorage.getItem('cachedStatuses');
  const savedTimestamp = localStorage.getItem('cacheTimestamp');

  if (savedCache && savedTimestamp) {
    const parsedCache = JSON.parse(savedCache);
    cacheTimestamp = Number(savedTimestamp);

    (async () => {
      // For each cached status:
      // If blobKey is present, load blob from IndexedDB and create blobUrl dynamically
      const statusesWithBlobs = await Promise.all(
        parsedCache.map(async (status) => {
          const fullStatus = {
            ...status,
            original_media_url: status.original_media_url || status.media_url,
          };

          if (fullStatus.blobKey) {
            // Retrieve blob and create URL dynamically
            try {
              const dbBlob = await getBlobFromDB(fullStatus.blobKey);
              if (dbBlob) {
                const blobUrl = URL.createObjectURL(dbBlob);
                window.myBlobUrl = blobUrl; // debug
                return { ...fullStatus, blobUrl };
              }
            } catch {
              // fallback: no blobUrl
            }
          }

          // fallback to fetch and cache blob
          return await ensureBlobUrl(fullStatus);
        })
      );

      cachedStatuses = statusesWithBlobs;
      const mediaUrls = cachedStatuses.map(s => s.media_url).filter(Boolean);
      console.info(`[${getFixedTime()}][Cache Init] Loaded cachedStatuses media_urls:`, mediaUrls);
    })();
  }
} catch (e) {
  console.error(`[${getFixedTime()}][Cache Init] Failed to load cache from localStorage:`, e);
}

const saveCacheToLocalStorage = () => {
  try {
    if (!cacheTimestamp) {
      console.warn(`[${getFixedTime()}][Cache Save] No cache timestamp set, skipping save.`);
      return;
    }
    // Save cachedStatuses with blobKey, remove blobUrl to avoid saving session-only URLs
    const cacheToSave = cachedStatuses?.map(({ blobUrl, ...rest }) => rest) || [];
    localStorage.setItem('cachedStatuses', JSON.stringify(cacheToSave));
    localStorage.setItem('cacheTimestamp', cacheTimestamp.toString());
  } catch (e) {
    console.error(`[${getFixedTime()}][Cache Save] Failed to save cache to localStorage:`, e);
  }
};

const isCacheValid = () => {
  if (!cacheTimestamp) return false;
  return Date.now() - cacheTimestamp < CACHE_DURATION_MS;
};

const generateThumbnail = async (mediaUrl) => {
  if (!mediaUrl) return null;

  try {
    const res = await fetch('http://localhost:5000/api/getMediaByUrl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media_url: mediaUrl }),
    });

    if (!res.ok) {
      console.error(`[${getFixedTime()}][Thumbnail] Failed to fetch media for thumbnail. Status: ${res.status}`);
      return null;
    }

    const blob = await res.blob();
    const type = blob.type;

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result;

        if (type.startsWith('image/')) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 64, 64);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          img.onerror = (err) => reject(err);
          img.src = src;
        } else if (type.startsWith('video/')) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.muted = true;
          video.src = src;
          video.onloadeddata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, 64, 64);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          video.onerror = (err) => reject(err);
        } else {
          resolve(null);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error(`[${getFixedTime()}][Thumbnail] Failed to generate thumbnail:`, e);
    return null;
  }
};

export const updateStatusMediaUrl = (statusId, newMediaUrl) => {
  if (!cachedStatuses) return;

  cachedStatuses = cachedStatuses.map((status) =>
    status.status_id === statusId
      ? { ...status, original_media_url: newMediaUrl, blobUrl: null, blobKey: null }
      : status
  );

  cacheTimestamp = Date.now();
  saveCacheToLocalStorage();
};

export const fetchAllStatuses = async () => {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      if (cachedStatuses) {
        cachedStatuses = await Promise.all(cachedStatuses.map(ensureBlobUrl));
      }
      return cachedStatuses || [];
    }

    let user;
    try {
      user = JSON.parse(rawUser);
    } catch {
      if (cachedStatuses) {
        cachedStatuses = await Promise.all(cachedStatuses.map(ensureBlobUrl));
      }
      return cachedStatuses || [];
    }

    if (cachedStatuses && isCacheValid()) {
      cachedStatuses = await Promise.all(cachedStatuses.map(ensureBlobUrl));
      return cachedStatuses;
    }

    const freshData = await refreshStatusesFromBackend(user.user_id);
    return freshData;
  } catch (e) {
    console.error(`[${getFixedTime()}][fetchAllStatuses] Unexpected error:`, e);
    if (cachedStatuses) {
      cachedStatuses = await Promise.all(cachedStatuses.map(ensureBlobUrl));
    }
    return cachedStatuses || [];
  }
};

const refreshStatusesFromBackend = async (user_id) => {
  try {
    const cachedToSend = (cachedStatuses || []).map(({ blobUrl, ...rest }) => rest);

    const res = await fetch('http://localhost:5000/api/getAllStatuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, cached_statuses: cachedToSend }),
    });

    if (!res.ok) {
      console.error(`[${getFixedTime()}][refreshStatusesFromBackend] Failed to fetch statuses. Status: ${res.status}`);
      return cachedStatuses || [];
    }

    const data = await res.json();

    if (data.invalid_caches?.length > 0) {
      const invalidIds = new Set(data.invalid_caches.map(s => s.status_id));
      cachedStatuses = (cachedStatuses || []).filter(status => !invalidIds.has(status.status_id));
      cacheTimestamp = Date.now();
      saveCacheToLocalStorage();
      console.info(`[${getFixedTime()}][Cache Cleanup] Removed invalid caches:`, invalidIds);
    }

    const statusesWithThumbnailsAndBlobs = await Promise.all(
      data.statuses.map(async (status) => {
        if (status.is_cached) {
          const cachedEntry = (cachedStatuses || []).find(s => s.status_id === status.status_id);
          if (cachedEntry) {
            const withBlobUrl = await ensureBlobUrl(cachedEntry);
            return {
              ...status,
              thumbnail: cachedEntry.thumbnail || null,
              blobUrl: withBlobUrl.blobUrl || null,
              blobKey: cachedEntry.blobKey || null,
            };
          }
        }

        const thumbnail = await generateThumbnail(status.original_media_url);
        const withBlob = await ensureBlobUrl(status);
        return { ...status, thumbnail, blobUrl: withBlob.blobUrl, blobKey: withBlob.blobKey };
      })
    );

    cachedStatuses = statusesWithThumbnailsAndBlobs;
    cacheTimestamp = Date.now();
    saveCacheToLocalStorage();
    if (pollingCallback) pollingCallback(cachedStatuses);
    return cachedStatuses;
  } catch (e) {
    console.error(`[${getFixedTime()}][refreshStatusesFromBackend] Unexpected error:`, e);
    return cachedStatuses || [];
  }
};

export const getCachedStatuses = () => cachedStatuses;

export const clearStatusCache = () => {
  cachedStatuses = null;
  cacheTimestamp = null;
  localStorage.removeItem('cachedStatuses');
  localStorage.removeItem('cacheTimestamp');
};

export const startPollingStatuses = (onUpdate) => {
  if (pollingIntervalId !== null) return () => {};
  pollingCallback = onUpdate;

  fetchAllStatuses().then((data) => {
    if (onUpdate) onUpdate(data);
  });

  pollingIntervalId = setInterval(async () => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return;

    let user;
    try {
      user = JSON.parse(rawUser);
    } catch {
      return;
    }

    const freshData = await refreshStatusesFromBackend(user.user_id);
    if (onUpdate) onUpdate(freshData);
  }, 5000);

  return () => {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      pollingIntervalId = null;
      pollingCallback = null;
    }
  };
};

export const stopPollingStatuses = () => {
  if (pollingIntervalId !== null) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
  }
};
