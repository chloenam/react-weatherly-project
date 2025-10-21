import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_WEATHER_BASE_URL,
  params: {
    key: import.meta.env.VITE_WEATHER_API_KEY,
    lang: "ko",
  },
});

export default axiosInstance;
