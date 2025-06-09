## 에러 핸들링 정의

### ♻️ 왜 에러 핸들링을 공통으로 처리해야 하는가

- 오류 포맷과 메시징 일원화
- 404, 400, 500 등에 따른 처리를 공통화 하여 사용자에게 일관된 피드백을 제공
- 운영 시 로그 작성을 통해 원인 파악을 용이하게 한다.
- 토큰 릴레이 등, 재시도가 필요할 경우 해당 로직을 중앙에 집중시킨다.

### 💯 에러 핸들링 전략 설계

> 이 분기 로직은 Axios 응답 인터셉터 내부에서 수행되며, 모든 요청 결과를 중앙에서 처리하도록 진행한다.

```typescript
// #. As-IS 만약 에러 중앙 처리를 진행하지 않았을 경우
// #. 모든 API 핸들링 함수에 다음과 같은 처리를 진행하여야 하며, 코드 가독성과 중복 문제가 발생한다.
export const fetchItems = async () => {
  try {
    const response = await axios.get(`/items`);
    return response.data?.data;
  } catch (e) {
    const error = e.error;
    if (error.status === 401) {
      tokenRelay();
    } else if (error.status === 404) {
      log.warn("API를 찾을 수 없습니다.");
    }
    (...)
  }
};

// #. apis/custom-instance.ts
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status || 500;
    const message = mapErrorMessage(status); // 커스텀 메시지 맵핑 함수
    return Promise.reject(
      new CustomError(status, message, "external", err.response?.data)
    );
  }
);

// #. 이렇게 했을 경우 다음과 같이 호출해주면 끝난다.
export const fetchItems = async () => {
  try {
    const response = await axios.get(`/items`);
    return response.data?.data;
  } catch (e) {
    const error = e.error as CustomError;
    log.error(error);
  }
};
```

1. 에러 발생시 에러 유형에 따른 분기 처리

> 예시
>
> - 404: `API를 찾을 수 없습니다.`
> - 401: `인증되지 않았습니다.` or `token relay`
> - 403: `권한 사용자 처리`
> - 500: `서버 에러 발생` or `Error 데이터 유형 분기(서버 Exception)`
> - 504: `요청 시간 초과 알림` or `retry`
> - 그 외: `axios 내부`나 클라이언트 에러 처리

2. 에러 구조 통일 & 메시지 처리 정의

- CustomError를 정의하여 status, message 등 주입

```typescript
// #. utils/custom-error.ts
export class CustomError extends Error {
  status: number;
  origin: "external" | "internal";
  payload?: any;
  code?: string; // 예시 "EXPIRED_TOKEN", "INVALID_STATE"

  constructor(
    status: number,
    message: string,
    origin: "external" | "internal" = "external",
    payload?: any
  ) {
    super(message);
    this.status = status;
    this.origin = origin;
    this.payload = payload;
  }
}

// #. utils/error-handler.ts
// #. 실제 핸들링 유틸은 실제 구현 코드(src/utils/*.ts)를 참고
export const errorHandler = (error: AxiosError) => {
  const response = error.response;
  if (!response) {
    return Promise.reject(new CustomError(0, "응답이 없습니다.", "external"));
  }

  const status = response.status;
  // #. response로 부터 에러 파싱
  (...)
  const customError = new CustomError(status, rawMessage, origin);

  // #. 분기별 에러 데이터(message, 에러코드 등) 주입
  switch (status) {
    case 400:
      (...)
      break;
    case 401:
      (...)
      break;
    case 404:
      (...)
      break;
    default:
      (...)
  }

  return Promise.reject(customError);
```

### 🚀 추가 고려 사항

- 다국어: 메시지 다국어화(i18n) 지원 설계
- 로깅 시스템: loki 전송 용 로그 파싱 등 구조화된 로깅 생성하기
- Retry 로직 작성: 단건 재시도 or 반복 재시도 고려
- 서버와의 에러 응답 포맷 (예시: { status, code, message })을 사전에 백엔드와 정의.
  - 일관된 에러 처리를 위함.
