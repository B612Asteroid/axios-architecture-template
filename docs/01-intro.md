## Axios 멀티 인스턴스를 왜 사용해야 하는가.

### 단순한 Axios 사용 시 문제

- 서비스마다 Response, error 핸들링 방식이 달라 Application에서 반복되는 문제를 해결하기 어렵다.
- axios 설정이 각 서비스 로직에 흩어지게 되므로 중복 코드, 강한 의존 현상이 일어난다.
- baseURL이 달라 일일이 env 혹은 constants에서 주소를 가져와야 하며, "휴먼 에러"가 일어날 확률이 높다.
- axios는 생각보다 정말 많은 정보를 가지고 있다. Response 파싱 시 복잡한 처리 로직이 중복으로 발생한다.
- 내장된 Retry, fallback 전략이 존재하지 않아, 응답 실패 시 전략을 세우기 어렵다.

```typescript
// 단순한 axios 사용 예시
import axios from "axios";

async function fetchUserData(userId: string) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  // #. status에 따른 에러 처리를 계속 진행
  if (response.status !== 200) {
    throw new Error("Failed to fetch user data");
  }
  // #. response.data 내부에 data가 또 있는 경우가 있다. response 뎁스도 코딩할 떄 문제가 될 수 있음.
  return response.data;
}

async function fetchOrders(userId: string) {
  // #. api 주소를 반복적으로 주입해줘야 함. 만약 주소에 오타 발생 시 바로 에러.
  const response = await axios.get(
    `https://api.example.com/orders?userId=${userId}`
  );
  if (response.status !== 200) {
    throw new Error("Failed to fetch orders");
  }
  return response.data;
}
```

### Axios 인스턴스를 사용했을 때 해결 되는 것들

- 모든 서비스가 일관된 API 핸들링을 가진다.
- Response가 단순해진다.
- Request시 Token, 커스텀 헤더 등을 공통으로 주입해 줄 수 있으므로 코드베이스에서는 "API 호출"에만 집중할 수 있다.
- 에러 핸들링을 중앙집중식으로 관리하여, 에러 유형에 대해 일관적인 정책으로 대응할 수 있다.
- API 별로 인스턴스를 분리하여 대응할 수 있으므로, API 호출 시 인스턴스 기반(주소 기반이 아닌)으로 접근할 수 있다.
- Typescript를 완벽하게 지원하며, 제네릭 형태로 응답 타입을 주입해 타입 검사에 유리하다.

```typescript
// #. 전역 커스터마이징 인스턴스를 설정했을 경우
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  // timeout: 20000,
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});

// #. 이렇게 처리할 수 있게 된다.
instance.get<any, Item[]>(`/classify`, { params });
```
