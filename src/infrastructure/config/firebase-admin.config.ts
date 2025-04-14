import admin from 'firebase-admin';
import * as fs from 'fs';
import { env } from '../../shared/utils/env.utils';

const serviceAccountPath = env.FIREBASE_CREDENTIALS;

if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `Arquivo de credenciais não encontrado: ${serviceAccountPath}`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: env.FIREBASE_BUCKET_URL,
});

const bucket = admin.storage().bucket();

export { bucket };
