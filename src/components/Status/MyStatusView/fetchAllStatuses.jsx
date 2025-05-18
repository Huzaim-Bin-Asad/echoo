const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

let cachedStatuses = null;
let cacheTimestamp = null;

// Initialize cache from localStorage
try {
  const savedCache = localStorage.getItem('cachedStatuses');
  const savedTimestamp = localStorage.getItem('cacheTimestamp');

  if (savedCache && savedTimestamp) {
    cachedStatuses = JSON.parse(savedCache);
    cacheTimestamp = Number(savedTimestamp);
    console.log(
      `[Cache Init] Loaded cache with ${cachedStatuses.length} statuses, timestamp: ${new Date(
        cacheTimestamp
      ).toISOString()}`
    );
  } else {
    console.log('[Cache Init] No existing cache found in localStorage.');
  }
} catch (e) {
  console.error('[Cache Init] Failed to load cache from localStorage:', e);
}

const saveCacheToLocalStorage = () => {
  try {
    if (!cacheTimestamp) {
      console.warn('[Cache Save] No cache timestamp set, skipping save.');
      return;
    }
    // Remove any transient properties like blobUrl before saving
    const cacheToSave = cachedStatuses?.map(({ blobUrl, ...rest }) => rest) || [];
    localStorage.setItem('cachedStatuses', JSON.stringify(cacheToSave));
    localStorage.setItem('cacheTimestamp', cacheTimestamp.toString());
    console.log(
      `[Cache Save] Cache saved with ${cacheToSave.length} statuses at ${new Date(
        cacheTimestamp
      ).toISOString()}`
    );
  } catch (e) {
    console.error('[Cache Save] Failed to save cache to localStorage:', e);
  }
};

const isCacheValid = () => {
  if (!cacheTimestamp) return false;
  const age = Date.now() - cacheTimestamp;
  return age < CACHE_DURATION_MS;
};

// --- Event Emitter for cache updates ---
const listeners = new Set();

export const subscribeCacheUpdates = (callback) => {
  listeners.add(callback);
  console.log('[Cache Subscribe] New subscriber added.');
  return () => {
    listeners.delete(callback);
    console.log('[Cache Subscribe] Subscriber removed.');
  };
};

const emitCacheUpdate = () => {
  console.log('[Cache Emit] Emitting cache update to subscribers.');
  for (const cb of listeners) {
    try {
      cb(cachedStatuses);
    } catch (e) {
      console.error('[Cache Emit] Error in subscriber callback:', e);
    }
  }
};

// --- New helper to update media_url of a specific status ---
export const updateStatusMediaUrl = (statusId, newMediaUrl) => {
  if (!cachedStatuses) return;

  cachedStatuses = cachedStatuses.map((status) => {
    if (status.status_id === statusId) {
      if (status.media_url !== newMediaUrl) {
        console.log(`[updateStatusMediaUrl] Updating media_url for status_id ${statusId}`);
        return { ...status, media_url: newMediaUrl };
      }
    }
    return status;
  });

  cacheTimestamp = Date.now();
  saveCacheToLocalStorage();
  emitCacheUpdate();
};

// Fetch statuses with cache fallback
export const fetchAllStatuses = async () => {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      console.warn('[fetchAllStatuses] No user found in localStorage. Returning cached or empty array.');
      return cachedStatuses || [];
    }

    let user;
    try {
      user = JSON.parse(rawUser);
      console.log(`[fetchAllStatuses] Loaded user_id: ${user.user_id}`);
    } catch {
      console.error('[fetchAllStatuses] Failed to parse user from localStorage.');
      return cachedStatuses || [];
    }

    if (cachedStatuses && isCacheValid()) {
      console.log('[fetchAllStatuses] Returning valid cached data.');
      return cachedStatuses;
    }

    // Fetch fresh data if cache is invalid or empty
    const freshData = await refreshStatusesFromBackend(user.user_id);
    return freshData;
  } catch (e) {
    console.error('[fetchAllStatuses] Unexpected error:', e);
    return cachedStatuses || [];
  }
};

// Fetch fresh statuses from backend and update cache
const refreshStatusesFromBackend = async (user_id) => {
  try {
    const res = await fetch('http://localhost:5000/api/getAllStatuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id }),
    });

    if (!res.ok) {
      console.error(`[refreshStatusesFromBackend] Failed to fetch statuses. Status: ${res.status}`);
      return cachedStatuses || [];
    }

    const data = await res.json();
    console.log(`[refreshStatusesFromBackend] Received ${data.statuses.length} statuses from server.`);

    // Store raw metadata only (no blobs), including media_url from backend
    cachedStatuses = data.statuses;
    cacheTimestamp = Date.now();
    saveCacheToLocalStorage();
    emitCacheUpdate();
    console.log('[refreshStatusesFromBackend] Cache updated with latest data.');

    return cachedStatuses;
  } catch (e) {
    console.error('[refreshStatusesFromBackend] Unexpected error:', e);
    return cachedStatuses || [];
  }
};

export const getCachedStatuses = () => cachedStatuses;

export const clearStatusCache = () => {
  cachedStatuses = null;
  cacheTimestamp = null;
  localStorage.removeItem('cachedStatuses');
  localStorage.removeItem('cacheTimestamp');
  console.log('[Cache Clear] Cache cleared.');
  emitCacheUpdate();
};

// --- Polling logic ---
let pollingIntervalId = null;

export const startPollingStatuses = () => {
  if (pollingIntervalId !== null) {
    console.log('[Polling] Polling already started.');
    return;
  }

  console.log('[Polling] Starting polling immediately.');
  fetchAllStatuses();

  pollingIntervalId = setInterval(() => {
    console.log('[Polling] Polling triggered.');
    fetchAllStatuses();
  }, 10 * 1000);
};

export const stopPollingStatuses = () => {
  if (pollingIntervalId !== null) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
    console.log('[Polling] Polling stopped.');
  } else {
    console.log('[Polling] Polling was not running.');
  }
};
