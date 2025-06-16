import "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    meta?: {
      origin?: "internal" | "external";
      [key: string]: any;
    };
  }
}
