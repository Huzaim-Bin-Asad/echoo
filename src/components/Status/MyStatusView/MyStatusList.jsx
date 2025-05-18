import React, { useEffect, useState, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import { getCachedStatuses, subscribeCacheUpdates } from './fetchAllStatuses';

export default function MyStatusesList() {
  const [statuses, setStatuses] = useState([]);
  const [blobUrls, setBlobUrls] = useState({});

  // Use a ref to track current blobUrls so async callbacks get fresh data
  const blobUrlsRef = useRef(blobUrls);
  blobUrlsRef.current = blobUrls;

  // Map raw cached statuses to UI-friendly format and sort by timestamp desc
  const mapStatuses = (cached) => {
    if (!cached || cached.length === 0) return [];
    const sorted = [...cached].sort((a, b) => b.timestamp - a.timestamp);
    return sorted.map((status) => ({
      id: status.status_id,
      media_url: status.media_url,
      timestamp: new Date(status.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
  };

  // Fetch media blob URL from backend by media_url
  const fetchBlobUrl = async (status_id, media_url) => {
    if (!media_url) return null;
    try {
      const res = await fetch('http://localhost:5000/api/getMediaByUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_url }),
      });
      if (!res.ok) {
        console.warn(`[MyStatusesList] Failed to fetch media for status_id ${status_id}`);
        return null;
      }
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error(`[MyStatusesList] Error fetching media for status_id ${status_id}:`, e);
      return null;
    }
  };

  // Load cached statuses and fetch blob URLs for new statuses
  useEffect(() => {
    let isMounted = true;

    const loadStatusesAndBlobs = async () => {
      const cached = getCachedStatuses();
      const mapped = mapStatuses(cached);
      if (!isMounted) return;

      setStatuses(mapped);

      for (const { id, media_url } of mapped) {
        if (!blobUrlsRef.current[id]) {
          const url = await fetchBlobUrl(id, media_url);
          if (url && isMounted) {
            setBlobUrls((prev) => ({ ...prev, [id]: url }));
          }
        }
      }
    };

    loadStatusesAndBlobs();

    const unsubscribe = subscribeCacheUpdates(async (newCache) => {
      if (!isMounted) return;

      const mappedNew = mapStatuses(newCache);
      setStatuses(mappedNew);

      for (const { id, media_url } of mappedNew) {
        if (!blobUrlsRef.current[id]) {
          const url = await fetchBlobUrl(id, media_url);
          if (url && isMounted) {
            setBlobUrls((prev) => ({ ...prev, [id]: url }));
          }
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();

      // Revoke all blob URLs to free memory
      Object.values(blobUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
      setBlobUrls({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!statuses.length) {
    return (
      <p style={{ padding: '1rem', color: '#555', backgroundColor: '#f8f9fa', margin: 0 }}>
        No current status available.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y" style={{ maxWidth: 480, margin: '0 auto' }}>
      {statuses.map(({ id, timestamp }) => (
        <div
          key={id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            cursor: 'pointer',
            width: '100%',
            backgroundColor: '#ffffff',
            userSelect: 'none',
            color: '#212529',
            borderRadius: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#e9ecef',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {blobUrls[id] ? (
                <img
                  src={blobUrls[id]}
                  alt="Status Thumbnail"
                  style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#ccc' }} />
              )}
            </div>

            <p
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: '#212529',
                margin: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {timestamp}
            </p>
          </div>

          <MoreVertical size={28} style={{ color: '#6c757d', flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}
