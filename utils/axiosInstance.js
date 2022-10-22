import axios from 'axios';

const AxiosInstance = axios.create({
	baseURL: process.env.FRONTEND_URL,
});

export default AxiosInstance;
