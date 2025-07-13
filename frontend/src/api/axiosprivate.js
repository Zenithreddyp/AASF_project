import axios from "axios"
import { ACCESS_TOKEN } from "../constants"

export const privateApi = axios.create({ baseURL: import.meta.env.VITE_API_URL });

privateApi.interceptors.request.use((config) => {
  (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
});