import { AppException } from './AppException';

export class EntityNotFoundException extends AppException {
  constructor(entity: string) {
    super(`${entity} not found`, 404);
    this.name = 'EntityNotFoundException';
  }
}
