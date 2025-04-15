import React, { useEffect, useState } from "react";

const SlideWrapper = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10); // Trigger slide-in
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`position-fixed top-0 end-0 vh-100 bg-white w-100 shadow ${
        show ? "translate-middle-x-0" : "translate-middle-x-100"
      } transition-slide`}
      style={{
        zIndex: 1050, // Higher than normal
        transition: "transform 2.4s ease-in-out",
      }}
    >
      {children}
    </div>
  );
};

export default SlideWrapper;
