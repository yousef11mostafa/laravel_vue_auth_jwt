
// src/axios.js
import axios from 'axios';


// the new method
// Set up base URL for your API
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'; // Replace with your API URL

// Ensure cookies are sent with each request
axios.defaults.withCredentials = true;

export default axios;

// the old method
// Create an instance of Axios with default settings
// const instance = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/', // Your API base URL
//   timeout: 10000, // Optional: Set request timeout
// });

// Add a request interceptor to include the token in headers
// instance.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

// // Optionally, add a response interceptor to handle errors globally
// instance.interceptors.response.use(response => {
//   return response;
// }, error => {
//   // Handle errors globally (e.g., redirect to login on 401)
//   if (error.response && error.response.status === 401) {
//     // Handle unauthorized access (e.g., redirect to login)
//   }
//   return Promise.reject(error);
// });

// export default instance;
