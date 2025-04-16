import React from "react";
import { Phone, User } from "lucide-react";

const callData = [
  { name: "Uzbekistan", count: 2, time: "Today, 1:36 am" },
  { name: "Mummy Jee🎀✨", time: "Yesterday, 3:05 pm" },
  { name: "Waseem Uncle", time: "Yesterday, 11:29 am" },
  { name: "Waseem Uncle", time: "Yesterday, 11:28 am" },
  { name: "Waseem Uncle", count: 2, time: "Yesterday, 10:39 am" },
  { name: "Waseem Uncle", count: 2, time: "Yesterday, 10:37 am" },
  { name: "Waseem Uncle", count: 2, time: "Yesterday, 10:15 am" },
  { name: "Waseem Uncle", time: "Yesterday, 10:13 am" },
  { name: "Zainab Koochipoochi💗", time: "14 April, 5:22 pm" },
];

const CallList = () => {
  return (
    <div
      className="container"
      style={{
        maxHeight: "80vh",
        overflowY: "auto",
        paddingBottom: "70px",
        backgroundColor: "white",
        color: "black",
        borderRadius: "8px",
        position: "fixed",
      }}
    >
      {/* Subheading for recent inside scrollable container */}
      <div className="mt-3 mb-3">
        <h5 className="text-dark">Recent</h5>
      </div>

      {/* List of calls */}
      {callData.map((call, index) => (
        <div
          key={index}
          className="d-flex align-items-center mb-3 text-dark"
          style={{
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
          }}
        >
          <div className="me-3">
            <div
              className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
              style={{ width: 45, height: 45 }}
            >
              {call.avatar ? (
                <span style={{ fontSize: 20 }}>{call.avatar}</span>
              ) : (
                <User size={20} className="text-dark" />
              )}
            </div>
          </div>
          <div className="flex-grow-1">
            <div>
              {call.name}
              {call.count ? ` (${call.count})` : ""}
            </div>
            <small className="text-muted">{call.time}</small>
          </div>
          <div>
            <Phone size={20} className="text-dark" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CallList;
