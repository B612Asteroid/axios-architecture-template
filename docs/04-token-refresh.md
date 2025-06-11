## Token-refresh 전략

### ♻️ Token-refresh 전략은 왜 필요한가

- 사용자가 계속 로그인하고 있다는 인상을 주기 위해
- API 호출에서 갑자기 로그아웃 되거나, 오류 메시지를 보게 되는 순간을 방지하기 위해
- 끊김 없는 서비스를 제공하기 위하여

### 📩 refresh-token 구현 전략

- refreshToken은 HttpOnly 쿠키 or 암호화된 localStorage에 저장된다.
  - 단, 보안 상 HttpOnly + Secure 쿠키 사용이 권장됨
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
```

### 🚀 추가 고려 사항

- 백엔드와 토큰 생명주기, 토큰 응답 방식 결정하기
- 토큰 리프레쉬 실패 시, 로그인 화면으로 돌아가는 등 정책 결정하기
