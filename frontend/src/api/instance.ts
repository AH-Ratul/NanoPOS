import axios, { type AxiosResponse } from 'axios';
import { message } from 'antd';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error) => {
        const errorMsg = error.response?.data?.message || 'Something went wrong';
        message.error(errorMsg);

        if (error.response?.status === 401) {
            // Handle unauthorized - maybe redirect to login or clear context
            // window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
