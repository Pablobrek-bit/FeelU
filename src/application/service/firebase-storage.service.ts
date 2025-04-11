import { Injectable } from '@nestjs/common';
import { bucket } from '../../infrastructure/config/firebase-admin.config';
import { randomUUID } from 'crypto';

@Injectable()
export class FirebaseStorageService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${randomUUID()}-${file.originalname}`;

    const fileRef = bucket.file(fileName);

    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split(`${bucket.name}/`)[1];
    const fileRef = bucket.file(fileName);

    await fileRef.delete();
  }
}
