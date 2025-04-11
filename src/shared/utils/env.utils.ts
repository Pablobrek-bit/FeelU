import * as dotenv from 'dotenv';

dotenv.config();

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
  FIREBASE_CREDENTIALS: string;
  FIREBASE_BUCKET_URL: string;
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
  'FIREBASE_CREDENTIALS',
  'FIREBASE_BUCKET_URL',
];

// Valida se todas as variáveis obrigatórias estão presentes
for (const key of requiredEnvVariables) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// Valida se o arquivo de credenciais do Firebase existe
// const firebaseCredentialsPath = process.env.FIREBASE_CREDENTIALS!;
// if (!existsSync(firebaseCredentialsPath)) {
//   throw new Error(
//     `Firebase credentials file not found at: ${firebaseCredentialsPath}`,
//   );
// }

// Define as variáveis de ambiente tipadas
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
  FIREBASE_CREDENTIALS: process.env.FIREBASE_CREDENTIALS!,
  FIREBASE_BUCKET_URL: process.env.FIREBASE_BUCKET_URL!,
};

console.log(`Environment variables loaded: ${JSON.stringify(env, null, 2)}`);

export { env };
