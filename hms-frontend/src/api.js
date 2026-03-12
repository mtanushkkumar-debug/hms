import axios from 'axios';

const api = axios.create({
    baseURL: 'https://hms-backend-58o9.onrender.com/api',
    withCredentials: true,
});

export default api;
