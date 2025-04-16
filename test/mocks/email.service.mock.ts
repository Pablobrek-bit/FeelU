import type { EmailService } from '../../src/application/service/email.service';

export const createMockEmailService = (): jest.Mocked<
  Partial<EmailService>
> => ({
  sendVerificationEmail: jest.fn(),
});
