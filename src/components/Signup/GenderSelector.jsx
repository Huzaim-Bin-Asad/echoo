import React, { useEffect, useState } from "react";

// Dynamically require all boy and girl images from assets
const importAll = (r) => r.keys().map(r);
const boyImages = importAll(require.context("../../assets", false, /boy\d*\.jpg|boy\.png/));
const girlImages = importAll(require.context("../../assets", false, /girl\d*\.jpg|girl\.jpg/));

const getRandomImage = (images) => {
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const GenderSelector = ({ formData, updateFormData }) => {
  const [randomBoyImage, setRandomBoyImage] = useState(null);
  const [randomGirlImage, setRandomGirlImage] = useState(null);

  useEffect(() => {
    // Randomly pick one image each for boy and girl when component mounts
    setRandomBoyImage(getRandomImage(boyImages));
    setRandomGirlImage(getRandomImage(girlImages));
  }, []);

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
          src={randomBoyImage}
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
          src={randomGirlImage}
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
