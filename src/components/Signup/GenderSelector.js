import React, { useState } from "react";
import boyImg from "../../assets/boy.png";
import girlImg from "../../assets/girl.jpg";

const GenderSelector = () => {
  const [selected, setSelected] = useState("");

  return (
    <div className="d-flex justify-content-center my-4 gap-4">
      {/* Boy */}
      <div
        onClick={() => setSelected("boy")}
        style={{
          borderRadius: "50%",
          padding: "5px",
          border: selected === "boy" ? "3px solid #007bff" : "3px solid transparent",
          cursor: "pointer",
        }}
      >
        <img
          src={boyImg}
          alt="Boy"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Girl */}
      <div
        onClick={() => setSelected("girl")}
        style={{
          borderRadius: "50%",
          padding: "5px",
          border: selected === "girl" ? "3px solid #ff69b4" : "3px solid transparent",
          cursor: "pointer",
        }}
      >
        <img
          src={girlImg}
          alt="Girl"
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
