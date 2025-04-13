const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  AUTH_URL: process.env.REACT_APP_AUTH_URL || 'http://localhost:5000/auth',
  JOURNAL_URL: process.env.REACT_APP_JOURNAL_URL || 'http://localhost:5000/journal',
  // Add other endpoints as needed
};

export default API_CONFIG;
