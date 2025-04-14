import type { HttpStatus } from '@nestjs/common';

export type ResponseBodyType<T> = {
  statusCode: HttpStatus;
  timestamp: string;
  path: string;
  message: T;
};
