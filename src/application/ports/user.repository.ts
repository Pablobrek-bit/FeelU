export abstract class UserRepository {
  abstract existUserByEmail(email: string): Promise<boolean>;
  abstract createUser(user: {
    email: string;
    password: string;
  }): Promise<string>;
  abstract findUserByEmail(email: string): Promise<{
    id: string;
    email: string;
    password: string;
    role: string;
  } | null>;
}
