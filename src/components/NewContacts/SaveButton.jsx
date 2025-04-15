import React from "react";

const SaveButton = () => (
<div className="position-absolute bottom-0 start-0 w-100 p-5" style={{ maxWidth: "700px", marginBottom: "6%" }}>
  <button type="submit" className="btn btn-light border rounded-pill w-100">
    Save
  </button>
</div>


);

const SaveButtonWithMedia = () => (
  <>
    <SaveButton />
    <style >{`
      @media (min-width: 768px) {
        div {
          max-width: 900px; /* Increase max-width for tablets */
          margin-left: 0%; /* Center the button container for tablets */
        }
        button {
          font-size: 1.2rem; /* Slightly larger button font for tablets */
        }
      }
    `}</style>
  </>
);

export default SaveButtonWithMedia;
