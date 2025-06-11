## Token-refresh 전략

### ♻️ 외부 API 별로 Axios 인스턴스를 분리해야 하는 이유

- 서로 다른 baseURL, timeout, 인증 방식 등을 한 인스턴스에 담기 어려움
- API별로 개별 인터셉터 또는 에러 처리 전략을 적용하고 싶을 때
- API마다 다른 retry/fallback 정책이 필요할 떄(어떤 API는 retry 대신 알림 메시지를 넣고싶을 때 등)
-

### 📩 멀티 인스턴스 분리 전략

- 공통 인스턴스를 사용하고 주입하는 전략보다는, 인스턴스 자체를 분리하는 전략 사용.
  - 파일명에서 의도가 명확하게 드러남.
  - 코드 위치에서 명확한 책임 분리가 드러남.
  - 추후, API 당 제약사항이 늘어났을 때 IF문으로 분기하는게 아니라 인스턴스별로 처리하기도 쉬움.

```typescript
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

export const naverPayApi = axios.create({
  baseURL: "https://naver.com/pay",
  timeout: 5000,
});

naverPayApi.interceptors.request.use((config) => {
  const naverPayToken = "your-naver-pay-token";
  config.headers.Authorization = `Bearer ${naverPayToken}`;
  return config;
});
```

### 🚀 추가 고려 사항

- API가 많아지는데, baseURL 제외 변하는 내용이 없을 경우엔 공통 설정 주입도 고려.
- 실패시 전략을 공통 전략 or response 별 분리 전략을 취할지 고려
