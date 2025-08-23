import axios from 'axios';

const axiosNormal = axios.create({
    baseURL: 'https://food-hive-server.vercel.app',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosNormal;