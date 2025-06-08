import React from 'react';
import { ChevronRight } from 'lucide-react';

const ChevronButton = ({
  onClick,
    getGroupMembersId, // 👈 Callback to get groupMembersId
  backgroundColor = '#333',
  color = 'white'
}) => {
  const handleClick = () => {
    try {
      const storedData = JSON.parse(localStorage.getItem("groupMetaData"));
      const groupName = storedData?.groupName?.trim();

      if (!groupName) {
        onClick({ error: "Group name is required." });
      } else {
        const groupMembersId = getGroupMembersId?.(); // 👈 Get data from parent
        onClick({ success: true, groupMembersId });
      }
    } catch (err) {
      onClick({ error: "Invalid group metadata format." });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="position-fixed bottom-0 end-0 m-3 d-flex justify-content-center align-items-center"
      style={{
        width: 50,
        height: 50,
        backgroundColor,
        borderRadius: '12px',
        cursor: 'pointer',
      }}
    >
      <ChevronRight size={24} color={color} />
    </div>
  );
};

export default ChevronButton;
