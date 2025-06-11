import React from 'react';
import { ChevronRight } from 'lucide-react';

const ChevronButton = ({
  onClick,
  getGroupMembersId,
  backgroundColor = '#333',
  color = 'white',
}) => {
  // Helper: convert blob URL to base64 string
  const blobUrlToBase64 = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // includes data:image/... prefix
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleClick = async () => {
    try {
      const groupMetaDataRaw = localStorage.getItem('groupMetaData');
      const disappearingDisplayText = localStorage.getItem('disappearingDisplayText') || 'Off';
      const groupPermissionRaw = localStorage.getItem('GroupPermissionCache');
      const userRaw = localStorage.getItem('user');

      let groupMetaData = JSON.parse(groupMetaDataRaw);
      const groupPermission = JSON.parse(groupPermissionRaw);
      const user = JSON.parse(userRaw);

      const groupMembersId = getGroupMembersId?.();
      const currentUserId = user.user_id;

      // ✅ Convert blob URL to base64 if needed
      if (groupMetaData.groupImage?.startsWith('blob:')) {
        groupMetaData.groupImage = await blobUrlToBase64(groupMetaData.groupImage);
      }

      const payload = {
        groupMetaData,
        disappearingDisplayText,
        groupPermission,
        createdBy: currentUserId,
        groupMembersId,
      };

      const response = await fetch('http://localhost:5000/api/create_groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Group created successfully:', result);
      } else {
        console.error('Group creation failed:', result.error);
      }
    } catch (error) {
      console.error('[ChevronButton] Error:', error);
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
