import React from "react";

const SignupProgress = ({ currentStep = 1, totalSteps = 5 }) => {
  return (
    <div className="d-flex justify-content-center gap-2 my-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <span
          key={step}
          className="rounded-circle"
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: step === currentStep ? "#dc3545" : "#6c757d",
            opacity: step === currentStep ? 1 : 0.3
          }}
        ></span>
      ))}
    </div>
  );
};

export default SignupProgress;