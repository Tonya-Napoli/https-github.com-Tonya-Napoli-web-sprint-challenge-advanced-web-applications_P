// ✨ implement axiosWithAuth
import axios from 'axios';


const axiosWithAuth = () => {
    const token = localStorage.getItem('token');//grabbing token from local storage


    return axios.create({
        baseURL: 'http://localhost:9000',
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};


export default axiosWithAuth;