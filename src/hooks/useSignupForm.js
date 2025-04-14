import { useState } from 'react';
import { submitSignupForm } from '../services/SignupApi';  // Import the submitSignupForm from api.js

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
    console.log(`[FORM] Updating field '${field}' with value:`, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('[FORM] New form state:', newData);
      return newData;
    });
  };

  const validateStep = (currentStep) => {
    console.log(`[VALIDATION] Validating step ${currentStep}`);
    
    let isValid = false;
    let validationMessage = '';

    switch (currentStep) {
      case 1:
        isValid = formData.firstName.trim() && formData.lastName.trim();
        validationMessage = isValid 
          ? 'First and last name are valid' 
          : 'First and last name are required';
        break;
      case 2:
        isValid = formData.email.trim() && formData.username.trim();
        validationMessage = isValid
          ? 'Email and username are valid'
          : 'Email and username are required';
        break;
      case 3:
        isValid = formData.password && 
                 formData.confirmPassword && 
                 formData.password === formData.confirmPassword;
        validationMessage = isValid
          ? 'Passwords match and are valid'
          : formData.password !== formData.confirmPassword 
            ? 'Passwords do not match' 
            : 'Password fields are required';
        break;
      case 4:
        isValid = Boolean(formData.gender);
        validationMessage = isValid
          ? 'Gender selected'
          : 'Please select a gender';
        break;
      case 5:
        isValid = true; // Profile picture is optional
        validationMessage = 'Profile picture step (optional)';
        break;
      default:
        isValid = false;
        validationMessage = 'Invalid step';
    }

    console.log(`[VALIDATION] Step ${currentStep} result:`, {
      isValid,
      message: validationMessage
    });

    return isValid;
  };

  // Add a debug function to log current state
  const debugFormState = () => {
    console.group('[FORM DEBUG] Current State');
    console.log('Full form data:', formData);
    console.log('Field Details:');
    Object.entries(formData).forEach(([key, value]) => {
      console.log(`  ${key}:`, value);
    });
    console.groupEnd();
  };

  return {
    formData,
    updateFormData,
    validateStep,
    submitForm: () => submitSignupForm(formData),  // Pass the current formData
    debugFormState
};
};

export default useSignupForm;
