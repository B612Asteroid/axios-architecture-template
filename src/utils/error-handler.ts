import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { CustomError } from "./custom-error";
import instance from "@/apis/custom-instance";

export interface ErrorResponse {
  message: string;
}

export const errorHandler = async (error: AxiosError) => {
  const response = error.response;
  if (!response) {
    return Promise.reject(new CustomError(0, "응답이 없습니다.", "external"));
  }

  const status = response.status;
  // #. origin 설정: Axios 인스턴스에서 config.meta.origin에 "internal"/"external" 지정
  const origin: "external" | "internal" =
    (error.config as any)?.meta?.origin === "internal"
      ? "internal"
      : "external";
  const rawMessage =
    (response.data as ErrorResponse)?.message ?? "처리 중 오류가 발생했습니다.";

  const customError = new CustomError(status, rawMessage, origin);

  switch (status) {
    case 400:
      customError.setUserMessage("잘못된 요청입니다.");
      customError.setPayload(response.data);
      customError.setCode("INVALID_REQUEST");
      break;
    case 401:
      try {
        const refreshToken = "your-refresh-token";
        if (refreshToken) {
          // #. 인스턴스가 아니라 액시오스를 타야 무한 호출을 방지함.
          const {
            data: { accessToken, refreshToken },
          }: { data: { accessToken: string; refreshToken: string } } =
            await axios.post(`/user/refresh?refreshToken=${refreshToken}`);

          const retryRequest = {
            ...error.config,
            headers: {
              ...error.config?.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          } as AxiosRequestConfig;
          return await instance.request(retryRequest);
        }
      } catch (e) {
        console.error("Token refresh Failed", e);
        // #. 에러 실패 로직 주입
        // #. 최종 실패이므로, 여기서 라우터 사용 등 실제 처리 진행
        customError.setUserMessage("로그인이 필요합니다.");
        customError.setCode("EXPIRED_TOKEN");
      }

      break;
    case 404:
      customError.setUserMessage("요청한 리소스를 찾을 수 없습니다.");
      customError.setCode("NOT_FOUND");
      break;
    default:
      customError.setUserMessage("알 수 없는 오류가 발생했습니다.");
      customError.setCode("INTERNAL_ERROR");
  }

  return Promise.reject(customError);
};
