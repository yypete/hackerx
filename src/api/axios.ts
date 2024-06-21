import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://hacker-news.firebaseio.com/v0/",
  timeout: 100000, // 请求超时时间设定为10秒
});

export default axiosInstance;
