import React, { useEffect, useState } from "react";
import { Pencil, MessageCircleMore, UserPlus } from "lucide-react";

const SwitchOption = ({ label, description, Icon, permissionKey }) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("GroupPermissionCache")) || {};
    if (permissionKey in stored) {
      setIsChecked(stored[permissionKey]);
    }
  }, [permissionKey]);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);

    const stored = JSON.parse(localStorage.getItem("GroupPermissionCache")) || {};
    const updated = {
      ...stored,
      [permissionKey]: newValue,
    };
    localStorage.setItem("GroupPermissionCache", JSON.stringify(updated));
    console.log("Updated GroupPermissionCache:", updated);
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
          {Icon && (
            <Icon
              size={26}
              style={{
                color: "#A78BFA",
                minWidth: 20,
                minHeight: 20,
                marginLeft: 0,
              }}
            />
          )}

          <div>
            <label
              className="form-check-label fw-bold"
              style={{ color: "#ffffff", cursor: "pointer", fontSize: "1.05rem" }}
            >
              {label}
            </label>
            {description && (
              <div
                className="small"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.8em",
                  marginTop: 3,
                  maxWidth: 370,
                }}
              >
                {description}
              </div>
            )}
          </div>
        </div>
        <input
          className="form-check-input custom-toggle"
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          style={{
            position: "absolute",
            top: "50%",
            right: -16,
            transform: "translateY(-50%) scale(1.4)",
            cursor: "pointer",
          }}
        />
      </div>
    </>
  );
};

const MembersCan = () => {
  return (
    <div
      className="p-3 mb-4 rounded"
      style={{
        backgroundColor: "#1e1b24",
        color: "#ffffff",
        width: "100%",
        maxWidth: "200vh",
        margin: "0 auto",
      }}
    >
      <h6
        className="mb-3"
        style={{
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: "0.95rem",
          fontWeight: "600",
          marginLeft: 2,
        }}
      >
        Members can:
      </h6>

      <SwitchOption
        label="Edit group settings"
        permissionKey="MemberEditGroupSetting"
        description="This includes the name, icon, description, disappearing message timer, and the ability to pin, keep or unkeep messages."
        Icon={Pencil}
      />
      <SwitchOption
        label="Send messages"
        permissionKey="MemberSendMessages"
        description=""
        Icon={MessageCircleMore}
      />
      <SwitchOption
        label="Add other members"
        permissionKey="MemberAddNewMembers"
        description=""
        Icon={UserPlus}
      />
    </div>
  );
};

export default MembersCan;
