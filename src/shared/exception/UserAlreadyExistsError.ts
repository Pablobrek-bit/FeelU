import { HttpStatus } from '@nestjs/common';
import { AppException } from './AppException';

export class UserAlreadyExistsError extends AppException {
  constructor() {
    super('User already exists', HttpStatus.NOT_FOUND);
    this.name = 'UserAlreadyExistsError';
  }
}
