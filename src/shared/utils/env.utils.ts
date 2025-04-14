import * as dotenv from 'dotenv';

dotenv.config();

// EMAIL_HOST=smtp.gmail.com
// EMAIL_PORT=587
// EMAIL_USER=tindaria1206@gmail.com
// EMAIL_PASSWORD=ewde nmty dhzy lvps

interface EnvConfig {
  NODE_ENV: 'dev' | 'prod' | 'test';
  PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;
  FIREBASE_CREDENTIALS: string;
  FIREBASE_BUCKET_URL: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  APP_URL: string;
}

const requiredEnvVariables: (keyof EnvConfig)[] = [
  'NODE_ENV',
  'PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_EXPIRATION_TIME',
  'FIREBASE_CREDENTIALS',
  'FIREBASE_BUCKET_URL',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'APP_URL',
];

for (const key of requiredEnvVariables) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV as 'dev' | 'prod' | 'test',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '3600s',
  FIREBASE_CREDENTIALS: process.env.FIREBASE_CREDENTIALS!,
  FIREBASE_BUCKET_URL: process.env.FIREBASE_BUCKET_URL!,
  EMAIL_HOST: process.env.EMAIL_HOST!,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_USER: process.env.EMAIL_USER!,
  APP_URL: process.env.APP_URL!,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,
};

export { env };
