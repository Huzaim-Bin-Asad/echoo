import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { Undo2, ChevronRight } from "lucide-react";

import SignupHeader from "../components/Signup/SignupHeader";
import PasswordHeader from "../components/Signup/PasswordHeader";
import NameInputFields from "../components/Signup/NameInputFields";
import EmailInputFields from "../components/Signup/EmailInputFields";
import PasswordInputFields from "../components/Signup/PasswordInputFields";
import SignupProgress from "../components/Signup/SignupProgress";
import GenderSelector from "../components/Signup/GenderSelector";
import UploadProfilePicture from "../components/Signup/UploadProfilePicture";
import useSignupForm from "../hooks/useSignupForm";
import ErrorCard from "../components/response/error"; // ✅ Import your custom error component

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasError, setHasError] = useState(false); // ✅ Track if there's an error
  const [validationError, setValidationError] = useState(""); // 🔸 new state
  const { formData, updateFormData, validateStep, submitForm } = useSignupForm();

  const handleContinue = async () => {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
      setValidationError("Please fill all required fields");
      return;
    } else {
      setValidationError(""); // Clear error if validation passes
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await submitForm();
        navigate("/signup-step-two");
      } catch (error) {
        console.error("Signup error:", error);
        setHasError(true); // ✅ Trigger error view on failure
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderHeader = () => {
    if (currentStep === 3) return <PasswordHeader />;
    if (currentStep === 4 || currentStep === 5) return null;
    return <SignupHeader />;
  };

  const renderFormFields = () => {
    switch (currentStep) {
      case 1:
        return <NameInputFields formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <EmailInputFields formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <PasswordInputFields formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <GenderSelector formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <UploadProfilePicture formData={formData} updateFormData={updateFormData} />;
      default:
        return <NameInputFields formData={formData} updateFormData={updateFormData} />;
    }
  };

  const getButtonText = () => {
    if (currentStep === 4) return "Choose Gender";
    if (currentStep === 5) return "Sign Up Account";
    return "Continue";
  };

  // ✅ Show error card if submission fails
  if (hasError) {
    return <ErrorCard onRetry={() => {
      setHasError(false);
      setCurrentStep(1);
    }} />;
  }

  return (
    <div
      className="d-flex flex-column align-items-start justify-content-between vh-100 px-4 py-3"
      style={{ backgroundColor: "#fff" }}
    >
      {/* Header - Back Icon */}
      <div className="w-100 d-flex align-items-start">
        <div style={{ cursor: "pointer" }} onClick={handleBack}>
          <Undo2 size={28} />
        </div>
      </div>

      {/* Content */}
      <Container className="text-start">
        {renderHeader()}
        {renderFormFields()}

        {/* Show validation error if exists */}
        {validationError && (
          <div className="text-danger mt-2 fw-semibold">
            {validationError}
          </div>
        )}

        <SignupProgress currentStep={currentStep} />

        {/* Continue Button */}
        <Button
          className="w-100 rounded-4 fw-semibold shadow"
          style={{ backgroundColor: "black", border: "none", height: "45px" }}
          onClick={handleContinue}
        >
          {getButtonText()}
        </Button>

        {/* Already have an account? */}
        <div className="mt-4 text-start">
          <span className="d-block">Already have an Account?</span>
          <div
            className="d-flex align-items-center text-danger fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            LOGIN <ChevronRight size={18} className="ms-1" />
          </div>
        </div>
      </Container>

      {/* Bottom Spacer */}
      <div></div>
    </div>
  );
};

export default Signup;
