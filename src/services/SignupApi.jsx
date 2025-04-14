// api.js
const API_URL = process.env.API_URL || 'http://localhost:5000'; // Use local URL by default

export const submitSignupForm = async (formData) => {
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
      const response = await fetch(`${API_URL}/signup`, {  // Use the API_URL
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
