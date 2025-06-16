## Typescript

### ♻️ Axios 사용시 Typescript를 사용해야 하는 이유

Axios를 커스터마이징할 경우, 기본적인 요청/응답 타입 외에도 config 객체, 인터셉터, 에러 핸들러 등 다양한 흐름에서 타입 안정성이 중요해진다.

- config 객체에 meta 필드 등을 주입할 때 타입 오류 방지
- Axios 응답 구조에 제네릭을 적용: 응답 타입을 지정하기 위해
- 에러 핸들러에서 CustomError 구조를 구성하여 `Type-safe`한 에러 처리를 지원
- _중요_ IDE 혹은 VSC 등 코드 편집기 지원

### 📩 Axios 용 Typescript 적용 전략

Axios는 이미 Type을 가지고 있는 라이브러리이기 때문에, declare를 통해 커스텀 속성을 주입해줘야 함.

- tsconifg.json에 d.ts 형식 파일 지정
- `axios.d.ts`에 타입 확장 정의

```typescript
// #. 예시: config.meta.origin 타입 확장을 위한 axios.d.ts 선언
// #. tsconfig.json에 다음과 같이 지정 필요.
{
  "compilerOptions": {
    ...
    "typeRoots": ["./node_modules/@types", "src/types"]
  },
  "include": ["src", "src/types"]
}


// #. src/types/axios.d.ts
import "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    meta?: {
      origin?: "internal" | "external";
      [key: string]: any;
    };
  }
}

```

⚠️ 주의사항

- d.ts 지정 시 `declare module "axios"` 형태로 반드시 기존 라이브러리를 확장해야 함.
- tsconfig 사용 시 폴더구조에 주의

### 🛠️ Axios Request / Response 타입 지정

Axios에서 get/post 요청 진행 시 Request와 Response 타입을 지정해 줄 수 있다.

- ※ Axios는 첫 번째 제네릭을 요청 body로, 두 번째 제네릭을 응답 타입으로 처리.
- axios.get / post는 `<Request, Response>`를 Generic 방식으로 주입하도록 지원.

```typescript
// #. interfaces/axios-type.ts
export interface IRequest {
  id?: number;
  name?: string;
}

export interface IResponse {
  id?: number;
  name: string;
  code?: string;
  description?: string;
  items?: [{ itemOrder?: number; itemName: string }];
}

// #. instance 내부에서 data를 출력하도록 이미 설정을 해 놓았기 때문에, res.data 형식으로 또 낼 필요가 없다.
async function typeTestCall() {
  const res = await instance.get<IRequest, IResponse>(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  console.log(res);
}
```

### 🚀 추가 고려 사항

- 타입 지정을 위해 미리 백엔드와 협의 혹은 API 명세 확인.
- 타입 지정 시, linting에 의해 컴파일 에러를 낼 수 있도록 strict 모드 활성화.
