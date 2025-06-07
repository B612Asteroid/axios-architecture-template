## Axios 공통 인터셉터 정의

### ♻️ 공통 인터셉터 설계가 필요한 이유

- 모든 요청에 공통적으로 적용되는 로직을 공통화 한다.
- 에러 헨들링, 요청 처리, 응답 처리를 일원화 한다.
- 일원화 대상
  - 요청 로깅
  - 토큰 주입
  - 응답 정제
  - status(200, 400 등)에 따른 오류 포멧 일원화

```typescript
// src/apis/custom-instance.ts

import axios from "axios";
import { errorHandler } from "../utils/errorHandler";

const instance = axios.create({
  baseURL: "https://api.example.com",
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
```

### 💯 실제 사용 예시

만약 instance를 사용하지 않았을 경우, 중복 코드가 늘어난다.

```typescript
export const fetchItems = async () => {
  const response = await axios.get(`/items`);
  if (response.status !== 200) {
    (...) // #. 에러 status 관리
    throw new Error("Failed to fetch getItems");
  }
  return response.data?.data;
};

export const insertItem = async (data: any) => {
  const response = await axios.post(`/items`, data);
  if (response.status !== 200) {
    (...) // #. 에러 status 관리
    throw new Error("Failed to fetch insertItems");
  }
  return response.data?.data;
};
```

다응과 같이 간단히 호출 할 수 있게 된다.

```typescript
import instance from "./custom-instance";

export const fetchItems = async () => {
  return await instance.get("/items");
};

export const createItem = async (data: any) => {
  return await instance.post("/items", data);
};
```

### 🚀 추가 고려 사항

- **토큰 위치 주입**: interceptor 내부에서 토큰을 주입할 경우, 브라우저 환경과 Node 환경에 따라 토큰 저장 위치가 달라져야 함.
- **에러 핸들러 작성**: errorHandler가 길어진다면 공통 유틸로 분리해야 하며, logging/reporting 시스템과 연계할 수 있도록 해야 함.
- **API 위치 별 분리**: 서비스별 API 호출 서버가 다를 떈, 인스턴스를 분리하여 관리해야 함.
- **인터셉터의 확장성**: 인터셉터가 지나치게 많은 책임을 갖지 않도록 유의.
