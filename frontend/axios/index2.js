// ✨ implement axiosWithAuth
import axios from 'axios';

const axiosWithAuth = () => {
    const token = localStorage.getItem('token');
    console.log("Token:", token); // Check if the token is correctly logged here
    return axios.create({
      baseURL: 'http://localhost:9000/api',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  



export default axiosWithAuth;