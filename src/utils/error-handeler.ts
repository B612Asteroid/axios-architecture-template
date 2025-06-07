import { AxiosError } from "axios";

export const errorHandler = (error: AxiosError) => {
  const status = error.status;
  switch (status) {
    case 400: {
    }
    case 401: {
    }
    case 404: {
    }
    default: {
    }
  }
};
