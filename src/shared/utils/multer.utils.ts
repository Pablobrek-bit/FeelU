import { UnsupportedMediaTypeException } from '@nestjs/common';
import { memoryStorage } from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const multerConfig = {
  storage: memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new UnsupportedMediaTypeException('Invalid file type'),
        false,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return callback(
        new UnsupportedMediaTypeException('File size exceeds limit of 5MB'),
        false,
      );
    }

    return callback(null, true);
  },
};
