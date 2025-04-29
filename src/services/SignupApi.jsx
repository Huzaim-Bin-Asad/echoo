// api.js
const API_URL = process.env.API_URL || 'https://echoo-backend.vercel.app'; // Use local URL by default


export const checkCredentials = async ({ email, username }) => {
    try {
      const response = await fetch(`${API_URL}/check-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          buttonId: 'case2',
        }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw responseData;
      }
  
      return responseData;
    } catch (error) {
      console.error('[CHECK CREDENTIALS] Error:', error);
      throw error;
    }
  };
 
  export const submitSignupForm = async (formData) => {
    console.log('[SUBMIT] Starting form submission with data:', formData);
  
    try {
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
  
      console.log('[SUBMIT] Sending request to API...');
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        body: submissionData,
      });
  
      const responseData = await response.json();
  
      console.log('[SUBMIT] Received response:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
  
      if (!response.ok) {
        console.error('[SUBMIT] API error response:', responseData);
        throw responseData;
      }
  
      // Save token, user, and timestamp to localStorage
      if (responseData.token && responseData.user) {
        const savedAt = new Date().toISOString(); // Local device time in ISO format
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData.user));
        localStorage.setItem('token_saved_at', savedAt);
        console.log('[SUBMIT] Token, user, and save time stored in localStorage at:', savedAt);
      }
  
      return responseData; // This should now include the profile picture URL.
  
    } catch (error) {
      console.error('[SUBMIT] Submission error:', {
        error: error.message,
        stack: error.stack,
        response: error.response
      });
      throw error;
    }
  };
  