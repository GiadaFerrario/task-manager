import * as axios from "axios";
import type {AxiosInstance} from "axios";

const axiosClient: AxiosInstance = axios.default.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'
})

export default axiosClient;