import React from 'react';
import { User } from 'lucide-react';

const recent = [
  { name: "Nasira Tufail", time: "Yesterday", seen: true },
  { name: "Motto 😑😜🙄", time: "9:13 am", seen: false },
  { name: "Ma'am Asma", time: "2 minutes ago", seen: false },
  { name: "Miss Raheela", time: "7:56 am", seen: true },
  { name: "Usman Bhai", time: "3:18 am", seen: false },
  { name: "Humaira Khanam [Admin]", time: "Yesterday", seen: true },
];

const RecentUpdates = () => (
  <div
    className="bg-white mt-2 px-3 py-2"
    style={{
      borderRadius: '12px',
      margin: '0 12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}
  >
    <h6 className="text-muted mb-3" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
      RECENT UPDATES
    </h6>

    <div style={{ display: 'none' }}>
      {recent.map((status, i) => (
        <div key={i} className="d-flex align-items-center mb-3">
          <div className="position-relative" style={{ width: 52, height: 52 }}>
            {/* Status ring with conditional color */}
            <div
              className="position-absolute top-0 start-0 rounded-circle"
              style={{
                width: 52,
                height: 52,
                background: status.seen
                  ? 'conic-gradient(#6c757d 0deg 80deg, transparent 80deg 280deg, #6c757d 280deg 360deg)'
                  : 'conic-gradient(#28a745 0deg 80deg, transparent 80deg 280deg, #28a745 280deg 360deg)',
                clipPath: 'circle(50% at center)',
              }}
            ></div>

            {/* White center with User icon */}
            <div
              className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: 44,
                height: 44,
              }}
            >
              <User size={24} color="#6c757d" />
            </div>
          </div>

          <div className="ms-3 flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <strong style={{ fontSize: '0.95rem' }}>{status.name}</strong>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>{status.time}</span>
            </div>
            <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
              {status.seen ? 'Seen' : 'New update'}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecentUpdates;
