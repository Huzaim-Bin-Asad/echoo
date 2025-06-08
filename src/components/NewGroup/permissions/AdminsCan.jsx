import React, { useEffect, useState } from "react";

const UserLockIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 28}
    height={props.size || 28}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-user-lock-icon lucide-user-lock"
    {...props}
  >
    <circle cx="10" cy="7" r="4" />
    <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
    <path d="M15 15.5V14a2 2 0 0 1 4 0v1.5" />
    <rect width="8" height="5" x="13" y="16" rx=".899" />
  </svg>
);

const AdminsCan = () => {
  const [isApproved, setIsApproved] = useState(false);

  // Load from sessionStorage
  useEffect(() => {
    const cache = JSON.parse(localStorage.getItem("GroupPermissionCache"));
    if (cache && typeof cache.AdminApproveNewMembers === "boolean") {
      setIsApproved(cache.AdminApproveNewMembers);
    }
  }, []);

  // Handle toggle change
  const handleToggle = () => {
    const newValue = !isApproved;
    setIsApproved(newValue);

    const existingCache = JSON.parse(localStorage.getItem("GroupPermissionCache")) || {};
    const updatedCache = {
      ...existingCache,
      AdminApproveNewMembers: newValue
    };

    localStorage.setItem("GroupPermissionCache", JSON.stringify(updatedCache));
    console.log("Updated GroupPermissionCache:", updatedCache);
  };

  return (
    <>
      <style>
        {`
          .custom-toggle:checked {
            background-color: #A78BFA !important;
            border-color: #A78BFA !important;
          }
          .custom-toggle:checked:focus {
            box-shadow: 0 0 0 0.25rem rgba(167, 139, 250, 0.5);
          }
          .custom-toggle {
            background-color: #6b5ca5;
            border-color: #6b5ca5;
            cursor: pointer;
            transition: background-color 0.3s, border-color 0.3s;
          }
        `}
      </style>

      <div
        className="p-3 rounded"
        style={{
          backgroundColor: "#1e1b24",
          color: "#ffffff",
          width: "100%",
          maxWidth: 700,
          margin: "0 auto",
          marginBottom: "20px",
          marginTop: "-20px",
        }}
      >
        <h6
          className="mb-3"
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.9rem",
            fontWeight: "600",
            marginLeft: 2,
          }}
        >
          Admins can:
        </h6>

        <div
          className="form-check form-switch d-flex mb-4"
          style={{
            position: "relative",
            paddingLeft: 0,
            paddingRight: 16,
            alignItems: "flex-start",
            width: "100%",
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          <div
            className="d-flex align-items-center"
            style={{
              gap: 18,
              flex: 1,
              maxWidth: "80%",
              marginLeft: -12,
            }}
          >
            <UserLockIcon
              size={28}
              style={{
                color: "#A78BFA",
                minWidth: 28,
                minHeight: 28,
                marginLeft: 0,
              }}
            />
            <div>
              <label
                className="form-check-label fw-bold"
                style={{ color: "#ffffff", cursor: "pointer", fontSize: "1.05rem" }}
              >
                Approve new members
              </label>
              <div
                className="small"
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.8rem",
                  marginTop: 3,
                  maxWidth: 370,
                }}
              >
                When turned on, admins must approve anyone who wants to join the group.
              </div>
            </div>
          </div>
          <input
            className="form-check-input custom-toggle"
            type="checkbox"
            checked={isApproved}
            onChange={handleToggle}
            style={{
              position: "absolute",
              top: "50%",
              right: -16,
              transform: "translateY(-50%) scale(1.4)",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default AdminsCan;
