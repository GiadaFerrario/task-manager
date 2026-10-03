import * as axios from "axios";
import type {AxiosInstance} from "axios";

const axiosClient: AxiosInstance = axios.default.create({
    baseURL: 'https://localhost:8000/api'
})

export default axiosClient;