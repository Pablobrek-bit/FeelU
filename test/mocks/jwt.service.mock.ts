import type { JwtService } from '@nestjs/jwt';

export const createMockJwtService = (): Pick<JwtService, 'sign'> => ({
  sign: jest.fn(),
});
