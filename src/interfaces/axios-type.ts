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
