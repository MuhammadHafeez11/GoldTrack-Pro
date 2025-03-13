import axios from 'axios'
import { toast } from 'react-toastify';
const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api/v1',
    // baseURL: 'https://akledgerbackend.softwisesol.com/api/v1',
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        const message = error.response.data.message;
        // Check if the error message indicates that the session has expired or token failed
        if (
          message && 
          (message.includes("Session expired") || message.includes("Not authorized, token failed."))
        ) {
          // Notify the user that their session has expired
          toast.error("Your session has expired. Please log in again.");
          // Clear any stored authentication data
          localStorage.removeItem('UserIDName');
          localStorage.removeItem('isAuthenticated');
          // Redirect to the login page
          window.location.href = '/';
        }
      }
      return Promise.reject(error);
    }
  );  

export default axiosInstance;