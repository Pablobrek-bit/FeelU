import { JwtPayload } from '../application/dto/auth/jwt-payload';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
