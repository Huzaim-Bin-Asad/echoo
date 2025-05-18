import React from 'react';
import { MoreVertical } from 'lucide-react';

function formatTimestamp(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  // Example formatting: "May 18, 2025, 12:49 PM"
  return date.toLocaleString(undefined, {
 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function MyStatusesList({ statuses }) {
  const cachedStatuses =
    (!statuses || statuses.length === 0)
      ? JSON.parse(localStorage.getItem('cachedStatuses') || '[]')
      : statuses;

  if (!cachedStatuses.length) {
    return (
      <p style={{ padding: '1rem', color: '#555', backgroundColor: '#f8f9fa', margin: 0 }}>
        No current status available.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y" style={{ maxWidth: 480, margin: '0 auto' }}>
      {cachedStatuses.map(({ status_id, timestamp, thumbnail }) => (
        <div
          key={status_id}
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
              {thumbnail ? (
                <img
                  src={thumbnail}
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
              {formatTimestamp(timestamp)}
            </p>
          </div>

          <MoreVertical size={28} style={{ color: '#6c757d', flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}
