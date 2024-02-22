// ✨ implement axiosWithAuth
import axios from 'axios';

export const axiosWithAuth =() => {
  const token = localStorage.getItem('token');
  console.log('axiosWithAuth token:', token);

  return axios.create({
    baseURL: 'http://localhost:9000/api',
      headers: {
          Authorization: token 
      },
  });
};
export default axiosWithAuth;