## Token-refresh 전략

### ♻️ Token-refresh 전략은 왜 필요한가

- 사용자가 계속 로그인하고 있다는 인상을 주기 위해
- API 호출에서 갑자기 로그아웃 되거나, 오류 메시지를 보게 되는 순간을 방지하기 위해
- 끊김 없는 서비스를 제공하기 위하여

### 📩 refresh-token 구현 전략

- 서버에서 access 토큰과 refresh 토큰을 동시에 받는다.
  - Access 토큰의 생명주기는 짧게, refresh 토큰의 생명주기는 길게 하여, 토큰 탈취 시 피해를 최소화 한다.
- API 호출 시 인증 에러(401)를 응답으로 받았을 때 refresh 토큰을 이용, 새로운 토큰을 발급받는다.
- 새로운 토큰을 이용하여 같은 주소로 재요청을 진행한다.
  - 단, 여기서는 custom-instance가 아닌 axios로 진행하여야 한다. instance를 사용할 경우 intercepter에 의해 무한호출됨.

```typescript
// #. TODO token-refresh 전략
try {
  const refreshToken = "your-refresh-token";
  if (refreshToken) {
    // #. 인스턴스가 아니라 액시오스를 타야 무한 호출을 방지함.
    const {
      data: { data: token },
    }: { data: { accessToken; refreshToken } } = await axios.post(
      `/user/refresh?refreshToken=${refreshToken}`
    );

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
  // #. TODO 여기에 인증 실패 에러 주입
}
```

### 🚀 추가 고려 사항

- 백엔드와 토큰 생명주기, 토큰 응답 방식 결정하기
- 토큰 리프레쉬 실패 시, 로그인 화면으로 돌아가는 등 정책 결정하기
