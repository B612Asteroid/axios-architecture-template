import axios from "axios";

// src/apis/kakaoApi.ts
export const kakaoApi = axios.create({
  baseURL: "https://kapi.kakao.com",
  timeout: 3000,
});

kakaoApi.interceptors.request.use((config) => {
  // #.
  const getKakaoToken = "your-kakao-api-token";
  config.headers.Authorization = `Bearer ${getKakaoToken}`;
  return config;
});
