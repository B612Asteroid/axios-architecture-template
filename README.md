# Readme.md

### Axios 커스터마이징 아키텍처 예제

이 레포지토리는 Axios를 커스터마이징하는 실전 전략을 문서화하고, 이를 뒷받침하는 예제 코드를 제공한다.  
단순한 HTTP 호출을 넘어, 공통 로직 구성과 장애 대응 전략을 어떻게 구조화할 수 있을지에 초점을 맞춘다.

> 실제 프로젝트에서는 Spring Boot 기반 백엔드와 연동되는 프론트엔드(React.js / vue.js)에서 사용하였으며,
> 이 예제는 학습 및 문서화를 위해 Node 환경으로 단순화하였습니다.

### 문서 구성

Axios 인스턴스 커스터마이징을 통해 다음에 대하여 설명한다.

1. Intro - Axios 커스터마이징을 사용해야 하는 이유
2. 공통 인터셉터 및 옵션 설계
3. 에러 핸들링 전략
4. 토큰 릴레이 설계
5. 멀티 인스턴스를 통한 외부 API 별 핸들링 전략
6. Typescript 지원 방법

> 각 단계는 단순한 설명 보다, 실무에서의 활용 전략에 대해 다룰 수 있도록 한다.
> 예제 코드를 첨부하여, 예시 기반으로 내용이 진행될 수 있도록 한다.

### 폴더 구조

```
📁 axios-architecture-template/
├── package.json
├── tsconfig.json
├── README.md
├── docs/  # 문서 폴더
│   ├── 01-intro.md
│   ├── 02-interceptor.md
│   ├── 03-error-handling.md
│   ├── 04-token-relay.md
│   ├── 05-multi-instance.md
│   └── 06-typescript.md
└── src/ # 예제 폴더
    ├── apis/ # 인스턴스 폴더
    │   ├── axiosInstance.ts
    │   └── exampleClient.ts
    ├── utils/
    │   ├── retry.ts
    │   └── errorHandler.ts
    └── index.ts # 진입점

```

### 🚀 시작하기

본 예제를 다운로드 받은 이후 다음과 같이 사용한다.

```shell
npm install # 의존성 설치

npm run start # 실행
```
