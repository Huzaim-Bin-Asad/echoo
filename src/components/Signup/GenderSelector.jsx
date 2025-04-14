import React from "react";
import boyImg from "../../assets/boy.png";
import girlImg from "../../assets/girl.jpg";

const GenderSelector = ({ formData, updateFormData }) => {
  return (
    <div className="d-flex justify-content-center my-4 gap-4">
      {/* Male */}
      <div
        onClick={() => updateFormData('gender', 'male')}
        style={{
          borderRadius: "50%",
          padding: "5px",
          border: formData.gender === "male" ? "3px solid #007074" : "3px solid transparent",
          cursor: "pointer",
          transition: "border 0.2s ease"
        }}
      >
        <img
          src={boyImg}
          alt="Male"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Female */}
      <div
        onClick={() => updateFormData('gender', 'female')}
        style={{
          borderRadius: "50%",
          padding: "5px",
          border: formData.gender === "female" ? "3px solid #E9A5F1" : "3px solid transparent",
          cursor: "pointer",
          transition: "border 0.2s ease"
        }}
      >
        <img
          src={girlImg}
          alt="Female"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>
    </div>
  );
};

export default GenderSelector;