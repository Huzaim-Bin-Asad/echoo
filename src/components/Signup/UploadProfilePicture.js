import React from "react";
import { SwitchCamera } from "lucide-react";

const UploadProfilePicture = ({ formData, updateFormData }) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData('profilePicture', e.target.files[0]);
      
      // Optional: Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFormData('profilePicturePreview', event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center my-5 gap-4">
      <label htmlFor="profile-upload" style={{ cursor: 'pointer' }}>
        <div
          className="d-flex align-items-center justify-content-center position-relative"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#f1f1f1",
            border: "2px dashed #ccc",
            overflow: "hidden"
          }}
        >
          {formData.profilePicturePreview ? (
            <img 
              src={formData.profilePicturePreview} 
              alt="Profile preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          ) : (
            <SwitchCamera size={36} />
          )}
        </div>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </label>

      <div className="text-start">
        <div style={{ fontSize: "1.5rem", fontWeight: "600", lineHeight: "1.2" }}>
          Upload
          <br />
          Profile Picture
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePicture;