import type { FirebaseStorageService } from '../../src/application/service/firebase-storage.service';

export const createMockFirebaseStorageService = (): jest.Mocked<
  Partial<FirebaseStorageService>
> => ({
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
});
