import axios from "axios";

// src/apis/naverPayApi.ts
export const naverPayApi = axios.create({
  baseURL: "https://naver.com/pay",
  timeout: 5000,
});

naverPayApi.interceptors.request.use((config) => {
  const naverPayToken = "your-naver-pay-token";
  config.headers.Authorization = `Bearer ${naverPayToken}`;
  return config;
});
