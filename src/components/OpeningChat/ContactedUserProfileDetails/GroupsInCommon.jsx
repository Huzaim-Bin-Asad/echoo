import React, { useState } from 'react';
import { Users, ChevronDown } from 'lucide-react';
import audioImg from '../../../assets/audio.jpg';
import clippcloudImg from '../../../assets/clippcloud.jpg';
import girl2 from "../../../assets/girl2.jpg";
import girl7 from "../../../assets/girl7.jpg";
import boy11 from "../../../assets/boy11.jpg";
import liked from "../../../assets/liked.png";
import girl11 from "../../../assets/girl11.jpg";
import boy9 from "../../../assets/boy9.jpg";
import boy6 from "../../../assets/boy6.jpg";
import girl12 from "../../../assets/girl12.jpg";

// Example: Add more than 3 groups to test the expansion logic
const groups = [
  {
    name: 'Audio 3.0',
    members: 'Huzaim, Uzair Pindi, You',
    image: audioImg,
  },
  {
    name: 'Clipp-Cloud',
    members: 'Huzaim, Shehryar Hassan, Uzair Pindi',
    bgColor: '#e5f5ec',
    image: clippcloudImg,
  },
  {
    name: 'React Wizards',
    members: 'You, Adeel, Sarah',
    bgColor: '#fce4ec',
    image: girl2,
  },
  {
    name: 'AI Builders',
    members: 'Huzaim, Uzair, GPT',
    bgColor: '#ede7f6',
    image: girl7,

  },
  {
    name: 'Bootstrap Champs',
    members: 'Huzaim, Shehryar, You',
    bgColor: '#e3f2fd',
    image: boy11,

  },
  {
    name: 'Night Owls',
    members: 'You, Huzaim, Lateef',
    bgColor: '#f9fbe7',
    image: liked,
  },
  {
    name: 'Frontend Fanatics',
    members: 'Uzair, Sarah, GPT',
    bgColor: '#fff3e0',
    image: girl11,
  },
  {
    name: 'UX Ninjas',
    members: 'Adeel, Shehryar, Huzaim',
    bgColor: '#e1f5fe',
    image: boy9,
  },
  {
    name: 'Serverless Squad',
    members: 'You, Uzair, Lambda',
    bgColor: '#f3e5f5',
    image: boy6,
  },
  {
    name: 'Code & Coffee',
    members: 'Huzaim, GPT, Uzair',
    bgColor: '#efebe9',
    image: girl12,
  }
];



const GroupsInCommon = () => {
  const [expanded, setExpanded] = useState(false);

  const visibleGroups = expanded ? groups : groups.slice(0, 3);
  const hiddenCount = groups.length - 3;

  return (
    <div
      className="d-flex flex-column bg-white rounded shadow-sm"
      style={{
        padding: "1.25rem",
        width: "calc(100% + 36px)",
        marginLeft: "-22px",
        marginTop: "10px",
        marginBottom: "20px",
      }}
    >
      <small
        className="text-muted"
        style={{ fontSize: '0.8rem', marginTop: '-15px', marginBottom: "12px" }}
      >
        {groups.length} Groups in common
      </small>

      <div className="d-flex align-items-center" style={{ marginBottom: "24px" }}>
        <div
          className="me-4 d-flex justify-content-center align-items-center"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "#e5f5ec",
          }}
        >
          <Users size={22} className="text-success" />
        </div>
        <span className="fs-6">Create group with Huzaim</span>
      </div>

      <div className="d-flex flex-column gap-4">
        {visibleGroups.map((group, idx) => (
          <div key={idx} className="d-flex align-items-start">
            <div className="me-4">
              {group.image ? (
                <img
                  src={group.image}
                  alt={group.name}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center text-uppercase fw-bold"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: group.bgColor || "#e5f5ec",
                    fontSize: "0.85rem",
                    color: "#2e7d32",
                  }}
                >
                  {group.name
                    .split(" ")
                    .map(word => word[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
            </div>
            <div>
              <div className="fs-6 fw-semibold text-dark">{group.name}</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                {group.members}
              </div>
            </div>
          </div>
        ))}

        {!expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="btn btn-light d-flex align-items-center px-1 py-0"
            style={{
              marginTop: '10px',
              width: 'fit-content',
              fontSize: '0.9rem',
              color: '#712e7d',
              fontWeight: 500,
            }}
          >
            <ChevronDown size={18} className="me-1" />
            {hiddenCount} more
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupsInCommon;
