// Utility to clear any invalid tokens from localStorage
export function clearInvalidTokens() {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('auth_token');

      if (token) {
        // Check if token has the correct JWT structure (3 parts separated by dots)
        const parts = token.split('.');

        if (parts.length !== 3) {
          // If it's not a valid JWT structure, clear it
          localStorage.removeItem('auth_token');
          localStorage.removeItem('current_user_id');
          console.log('Cleared invalid token structure');
        } else {
          // If it looks like a JWT, try to decode the payload part
          const payload = parts[1];

          // Add padding if needed
          let paddedPayload = payload;
          while (paddedPayload.length % 4) {
            paddedPayload += '=';
          }

          try {
            // Try to decode the payload to see if it's valid base64
            atob(paddedPayload);
          } catch (e) {
            // If payload can't be decoded, clear the token
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user_id');
            console.log('Cleared invalid token payload');
          }
        }
      }
    } catch (e) {
      // If there's any error checking the token, clear it
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user_id');
      console.log('Cleared token due to error checking');
    }
  }
}