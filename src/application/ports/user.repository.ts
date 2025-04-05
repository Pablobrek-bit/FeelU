export abstract class UserRepository {
  abstract existUserByEmail(email: string): Promise<boolean>;
  abstract createUser(user: {
    email: string;
    password: string;
  }): Promise<string>;
  abstract teste(): Promise<void>;
}
