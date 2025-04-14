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
import ErrorCard from "../components/response/error";
import { submitSignupForm } from "../services/SignupApi";

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const { formData, updateFormData, validateStep, checkCredentials } = useSignupForm();

  const handleContinue = async () => {
    const { isValid, message } = validateStep(currentStep);
  
    if (!isValid) {
      setValidationError(message);
      return;
    } else {
      setValidationError("");
    }
  
    if (currentStep === 2) {
      try {
        await checkCredentials(); // <- Call backend validation
      } catch (error) {
        if (error.errors) {
          if (error.errors.email) {
            setValidationError(error.errors.email);
          } else if (error.errors.username) {
            setValidationError(error.errors.username);
          } else {
            setValidationError("Email or username already in use.");
          }
        } else {
          setValidationError("Error checking credentials.");
        }
        return; // Don't proceed to next step
      }
    }
  
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        const response = await submitSignupForm(formData);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/signup-step-two");
      } catch (error) {
        console.error("Signup error:", error);
        setHasError(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      setCurrentStep(prev => prev - 1);
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
        return null;
    }
  };

  const getButtonText = () => {
    if (currentStep === 4) return "Choose Gender";
    if (currentStep === 5) return isSubmitting ? "Creating Account..." : "Sign Up Account";
    return "Continue";
  };

  if (hasError) {
    return (
      <ErrorCard
        onRetry={() => {
          setHasError(false);
          setCurrentStep(1);
        }}
      />
    );
  }

  return (
    <div
      className="d-flex flex-column align-items-start justify-content-between vh-100 px-4 py-3"
      style={{ backgroundColor: "#fff" }}
    >
      {/* Header */}
      <div className="w-100 d-flex align-items-start">
        <div style={{ cursor: "pointer" }} onClick={handleBack}>
          <Undo2 size={28} />
        </div>
      </div>

      {/* Content */}
      <Container className="text-start">
        {renderHeader()}
        {renderFormFields()}

        {validationError && (
          <div className="text-danger mt-2 fw-semibold">
            {validationError}
          </div>
        )}

        <SignupProgress currentStep={currentStep} />

        <Button
          id={currentStep === 2 ? "case2" : undefined}
          className="w-100 rounded-4 fw-semibold shadow"
          style={{ backgroundColor: "black", border: "none", height: "45px" }}
          onClick={handleContinue}
          disabled={isSubmitting}
        >
          {getButtonText()}
        </Button>

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

      <div></div>
    </div>
  );
};

export default Signup;
