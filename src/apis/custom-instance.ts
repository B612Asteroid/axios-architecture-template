import axios from "axios";
import { errorHandler } from "@/utils/error-handeler";

const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
});

// 요청 인터셉터
instance.interceptors.request.use((config) => {
  // 예: 토큰 삽입
  const token = `YOUR TOKEN HERE`;
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    // #. 서버 response에 따른 응답 정제
    return response.data;
  },
  (error) => {
    // #. 에러 핸들링
    return errorHandler(error);
  }
);

export default instance;
