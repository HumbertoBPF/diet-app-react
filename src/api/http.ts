import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = () => {
    const token = Cookies.get('token');

    const instance = axios.create({
        baseURL: process.env.REACT_APP_HTTP_API_URL,
        headers: { Authorization: `Bearer ${token}` },
    });

    return instance;
};

export default axiosInstance;
