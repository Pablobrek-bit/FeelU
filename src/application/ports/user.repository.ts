import type { Gender, Role, SexualOrientation } from '@prisma/client';
import type { UserModel } from '../../domain/model/user-model';

export abstract class UserRepository {
  abstract existUserByEmail(email: string): Promise<boolean>;

  abstract createUser(user: {
    email: string;
    password: string;
    roleName: string;
    verificationToken: string;
  }): Promise<string>;

  abstract findUserByEmail(email: string): Promise<{
    id: string;
    email: string;
    password: string;
    role: Role;
  } | null>;

  abstract existUserById(userId: string): Promise<boolean>;

  abstract updateUserPassword(userId: string, password: string): Promise<void>;

  abstract getById(userId: string): Promise<UserModel | null>;

  abstract findUserByIds(userIds: string[]): Promise<UserModel[]>;

  abstract updateUserRole(userId: string, roleName: string): Promise<void>;

  abstract findPotentialMatches(
    userId: string,
    viewedUserIds: string[],
    genders: Gender[],
    sexualOrientations: SexualOrientation[],
    limit: number,
  ): Promise<UserModel[]>;

  abstract findUserByVerificationToken(token: string): Promise<string | null>;

  abstract updateUserVerificationToken(userId: string): Promise<void>;
}
