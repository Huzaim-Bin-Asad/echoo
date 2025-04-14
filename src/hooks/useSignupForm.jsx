import { useState } from 'react';
import { submitSignupForm, checkCredentials } from '../services/SignupApi';

const useSignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    profilePicture: null,
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (currentStep) => {
    let isValid = false;
    let message = '';

    switch (currentStep) {
      case 1:
        if (!formData.firstName.trim() && !formData.lastName.trim()) {
          message = "Please fill in both First and Last Name.";
        } else if (!formData.firstName.trim()) {
          message = "Please fill in your First Name.";
        } else if (!formData.lastName.trim()) {
          message = "Please fill in your Last Name.";
        } else {
          isValid = true;
        }
        break;

      case 2:
        if (!formData.email.trim() && !formData.username.trim()) {
          message = "Please fill in both Email and Username.";
        } else if (!formData.email.trim()) {
          message = "Please fill in your Email address.";
        } else if (!formData.username.trim()) {
          message = "Please fill in your Username.";
        } else {
          isValid = true;
        }
        break;

      case 3:
        if (!formData.password || !formData.confirmPassword) {
          message = "Please fill in both Password fields.";
        } else if (formData.password !== formData.confirmPassword) {
          message = "Passwords do not match.";
        } else {
          isValid = true;
        }
        break;

      case 4:
        if (!formData.gender) {
          message = "Please choose a gender.";
        } else {
          isValid = true;
        }
        break;

      case 5:
        isValid = true; // profile picture is optional
        break;

      default:
        message = "Invalid form step.";
    }

    return { isValid, message };
  };

  return {
    formData,
    updateFormData,
    validateStep,
    submitForm: () => submitSignupForm(formData),
    checkCredentials: () => checkCredentials({
      email: formData.email,
      username: formData.username
    })
  };
};

export default useSignupForm;
