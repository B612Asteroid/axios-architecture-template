export class CustomError extends Error {
  status: number;
  origin: "external" | "internal";
  payload?: any;
  code?: string; // 예시 "EXPIRED_TOKEN", "INVALID_STATE"
  userMessage: string = "";

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

  setUserMessage(message: string) {
    this.userMessage = message;
  }

  setPayload(payload: any) {
    this.payload = payload;
  }

  setCode(code: string) {
    this.code = code;
  }
}
