import { useState } from 'react';

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
    profilePicturePreview: null
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

  const submitForm = async () => {
    console.log('[SUBMIT] Starting form submission with data:', formData);
    
    try {
      // Prepare the data for submission
      const submissionData = new FormData();
      submissionData.append('firstName', formData.firstName);
      submissionData.append('lastName', formData.lastName);
      submissionData.append('email', formData.email);
      submissionData.append('username', formData.username);
      submissionData.append('password', formData.password);
      submissionData.append('gender', formData.gender);
      
      if (formData.profilePicture) {
        console.log('[SUBMIT] Including profile picture in submission');
        submissionData.append('profilePicture', formData.profilePicture);
      }

      console.log('[SUBMIT] FormData contents:');
      // Log FormData entries (note: this requires modern browsers)
      for (const [key, value] of submissionData.entries()) {
        console.log(`  ${key}:`, value);
      }

      console.log('[SUBMIT] Sending request to API...');
      const response = await fetch('https://your-api-endpoint.com/signup', {
        method: 'POST',
        body: submissionData
      });

      console.log('[SUBMIT] Received response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[SUBMIT] API error response:', errorData);
        throw new Error(errorData.message || 'Signup failed');
      }

      const responseData = await response.json();
      console.log('[SUBMIT] Successful response data:', responseData);
      return responseData;

    } catch (error) {
      console.error('[SUBMIT] Submission error:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
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
    submitForm,
    debugFormState // Optional: call this when you want to see current state
  };
};

export default useSignupForm;