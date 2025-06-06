import { Camera, SmilePlus } from "lucide-react";
import { useState } from "react";

export default function GroupMetaData() {
  const [groupImage, setGroupImage] = useState(null);

  const openEmojiKeyboard = () => {
    const input = document.getElementById("groupNameInput");
    input.blur(); // reset focus
    setTimeout(() => input.focus(), 50);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setGroupImage(imageUrl);
    }
  };

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

      <div
        className="d-flex align-items-center justify-content-between px-3 border-bottom"
        style={{
          backgroundColor: "#9980e3a9",
          color: "white",
          paddingTop: "20px",
          paddingBottom: "16px",
          minHeight: "80px",
          borderBottom: "1px solid white",
        }}
      >
        {/* Profile Picture Upload */}
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
            flexShrink: 0,
            overflow: "hidden",
            position: "relative",
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

        {/* Input Field */}
        <div className="flex-grow-1 me-2">
          <input
            type="text"
            id="groupNameInput"
            placeholder="Group Name"
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

        {/* Emoji Button */}
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
}
