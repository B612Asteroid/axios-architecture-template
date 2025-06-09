import { AxiosError } from "axios";
import { CustomError } from "./custom-error";

export interface ErrorResponse {
  message: string;
}

export const errorHandler = (error: AxiosError) => {
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
      customError.setUserMessage("로그인이 필요합니다.");
      customError.setCode("EXPIRED_TOKEN");
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
