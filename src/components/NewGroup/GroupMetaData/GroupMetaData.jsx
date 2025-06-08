import { Camera, SmilePlus } from "lucide-react";
import { useEffect, useImperativeHandle, forwardRef, useState } from "react";

const GroupMetaData = forwardRef(({ onMetaDataChange }, ref) => {
  const [groupImage, setGroupImage] = useState(null);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const storedImage = sessionStorage.getItem("groupImage");
    const storedName = sessionStorage.getItem("groupName");

    if (storedImage) setGroupImage(storedImage);
    if (storedName) setGroupName(storedName);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("groupImage", groupImage || "");
    sessionStorage.setItem("groupName", groupName);

    if (onMetaDataChange) {
      onMetaDataChange({ groupImage, groupName });
    }
  }, [groupImage, groupName]);

  const openEmojiKeyboard = () => {
    const input = document.getElementById("groupNameInput");
    input.blur();
    setTimeout(() => input.focus(), 50);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setGroupImage(imageUrl);
    }
  };

  useImperativeHandle(ref, () => ({
    getGroupMetaData: () => ({
      groupImage,
      groupName,
    }),
  }));

  return (
    <>
      <style>
        {`
          #groupNameInput::placeholder {
            color: white !important;
            opacity: 1;
          }
        `}
      </style>

      <div className="d-flex align-items-center justify-content-between px-3 border-bottom"
        style={{
          backgroundColor: "#9980e3a9",
          color: "white",
          paddingTop: "20px",
          paddingBottom: "16px",
          minHeight: "80px",
        }}
      >
        <label
          htmlFor="groupImageInput"
          className="me-3 d-flex justify-content-center align-items-center"
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: groupImage ? "transparent" : "white",
            backgroundImage: groupImage ? `url(${groupImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "50%",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {!groupImage && <Camera size={20} color="#121212" />}
          <input
            id="groupImageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>

        <div className="flex-grow-1 me-2">
          <input
            type="text"
            id="groupNameInput"
            value={groupName}
            placeholder="Group Name"
            onChange={(e) => setGroupName(e.target.value)}
            className="w-100"
            style={{
              backgroundColor: "transparent",
              border: "none",
              borderBottom: "1px solid white",
              color: "white",
              fontSize: "1rem",
              paddingBottom: "6px",
            }}
          />
        </div>

        <button
          onClick={openEmojiKeyboard}
          className="btn btn-link p-0"
          style={{ color: "white" }}
        >
          <SmilePlus size={18} />
        </button>
      </div>
    </>
  );
});

export default GroupMetaData;
