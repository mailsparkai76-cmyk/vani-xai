// Frontend API Configuration
// This determines where the frontend sends API requests

// Detect environment
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const isDevelopment = !isProduction;

// Set API endpoint based on environment
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000'  // Local development
  : 'https://backend-vani-xai.edgeone.app/'; // Change this to your production backend URL

// Example for production:
// const API_BASE_URL = isDevelopment 
//   ? 'http://localhost:5000'
//   : 'https://api.official-vani-xai.example.com'; // Replace with your actual backend URL

console.log(`🌐 Environment: ${isProduction ? 'production' : 'development'}`);
console.log(`📡 API Base URL: ${API_BASE_URL}`);

// Export for use in other scripts
window.API_BASE_URL = API_BASE_URL;
