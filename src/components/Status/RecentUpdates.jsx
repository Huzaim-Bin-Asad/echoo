import React from 'react';
import { User } from 'lucide-react'; // 👈 Import the User icon

const recent = [
  { name: "Nasira Tufail", time: "Yesterday" },
  { name: "Motto 😑😜🙄", time: "9:13 am" },
  { name: "Ma'am Asma", time: "2 minutes ago" },
  { name: "Miss Raheela", time: "7:56 am" },
  { name: "Usman Bhai", time: "3:18 am" },
  { name: "Humaira Khanam [Admin]", time: "Yesterday" },
  { name: "Nasira Tufail", time: "Yesterday" },
  { name: "Motto 😑😜🙄", time: "9:13 am" },
  { name: "Ma'am Asma", time: "2 minutes ago" },
  { name: "Miss Raheela", time: "7:56 am" },
  { name: "Usman Bhai", time: "3:18 am" },
  { name: "Humaira Khanam [Admin]", time: "Yesterday" },
];

const RecentUpdates = () => (
  <div className="bg-white mt-2 px-3 py-2">
    <h6 className="text-muted mb-3">Recent updates</h6>
    {recent.map((status, i) => (
      <div key={i} className="d-flex align-items-center mb-3">
        <div className="position-relative" style={{ width: 52, height: 52 }}>
          {/* Grey base ring */}
          <div
            className="rounded-circle"
            style={{
              width: 52,
              height: 52,
              backgroundColor: 'grey',
            }}
          ></div>

          {/* Green arcs with gap */}
          <div
            className="position-absolute top-0 start-0 rounded-circle"
            style={{
              width: 52,
              height: 52,
              background: 'conic-gradient(#28a745 0deg 80deg, transparent 80deg 280deg, #28a745 280deg 360deg)',
              clipPath: 'circle(50% at center)',
            }}
          ></div>

          {/* White center with User icon (larger) */}
          <div
            className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: 44,
              height: 44,
            }}
          >
            <User size={28} color="#6c757d" /> {/* Increased size to 28 */}
          </div>
        </div>
        <div className="ms-3">
          <strong>{status.name}</strong>
          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>{status.time}</p>
        </div>
      </div>
    ))}
  </div>
);

export default RecentUpdates;
