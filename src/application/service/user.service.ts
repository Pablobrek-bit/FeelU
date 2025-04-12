import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import { UserAlreadyExistsError } from '../../shared/exception/UserAlreadyExistsError';
import { FilterService } from './filter.service';
import { ProfileService } from './profile.service';
import { hash } from 'bcryptjs';
import { UpdateUserSchema } from '../dto/user/update-user-schema';
import { EntityNotFoundException } from '../../shared/exception/EntityNotFoundException';
import type { UserModel } from '../../domain/model/user-model';
import { RoleService } from './role.service';
import type { Gender, SexualOrientation } from '@prisma/client';
import { randomBytes } from 'crypto';
import { EmailService } from './email.service';
import { FirebaseStorageService } from './firebase-storage.service';
import type { CreateUserSchema } from '../dto/user/create-user-schema';
import { LikeService } from './like.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly filterService: FilterService,
    private readonly profileService: ProfileService,
    private readonly emailService: EmailService,
    private readonly roleService: RoleService,
    private readonly firebaseStorageService: FirebaseStorageService,
    private readonly likeService: LikeService,
  ) {}

  async createUser(
    userCreateData: CreateUserSchema,
    avatar: Express.Multer.File,
  ): Promise<void> {
    if (!avatar) {
      throw new BadRequestException('Avatar is required');
    }

    await this.ensureUserDoesNotExist(userCreateData.email);

    const passwordHash = await this.hashPassword(userCreateData.password);
    const verificationToken = this.generateVerificationToken();

    const userId = await this.userRepository.createUser({
      email: userCreateData.email,
      password: passwordHash,
      roleName: 'USER',
      verificationToken,
    });

    // const avatarUrl = await this.firebaseStorageService.uploadFile(avatar);
    const avatarUrl = 'https://example.com/avatar.jpg';

    await this.profileService.createProfile(
      userCreateData.profile,
      userId,
      avatarUrl,
    );
    await this.filterService.createFilter(userCreateData.filters, userId);

    // await this.emailService.sendVerificationEmail(
    //   userCreateData.email,
    //   verificationToken,
    // );
  }

  async updateUserDetails(
    userUpdateData: UpdateUserSchema,
    userId: string,
  ): Promise<void> {
    await this.ensureUserExists(userId);

    if (userUpdateData.password) {
      const passwordHash = await this.hashPassword(userUpdateData.password);
      await this.userRepository.updateUserPassword(userId, passwordHash);
    }

    await this.profileService.updateProfile(userUpdateData.profile, userId);
    await this.filterService.updateFilter(userUpdateData.filters, userId);
  }

  async getUserById(userId: string): Promise<UserModel> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new EntityNotFoundException('user');
    }

    // const likesAmount = await this.likeService.countByUserId(userId);
    // user.likes = likesAmount;

    return user;
  }

  async changeUserRole(userId: string, roleName: string): Promise<void> {
    await this.ensureUserExists(userId);
    await this.ensureRoleExists(roleName);

    await this.userRepository.updateUserRole(userId, roleName);
  }

  async findUsersByIds(userIds: string[]): Promise<UserModel[]> {
    return this.userRepository.findUserByIds(userIds);
  }

  async findPotentialMatches(
    userId: string,
    viewedUserIds: string[],
    genders: Gender[],
    sexualOrientations: SexualOrientation[],
    limit: number,
  ): Promise<UserModel[]> {
    return this.userRepository.findPotentialMatches(
      userId,
      viewedUserIds,
      genders,
      sexualOrientations,
      limit,
    );
  }

  async verifyEmail(token: string): Promise<void> {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    const userId = await this.userRepository.findUserByVerificationToken(token);
    if (!userId) {
      throw new EntityNotFoundException('user');
    }
    await this.userRepository.updateUserVerificationToken(userId);
  }

  async softDelete(userId: string): Promise<void> {
    await this.ensureUserExists(userId);
    await this.userRepository.softDeleteUser(userId);
  }

  private async ensureUserDoesNotExist(email: string): Promise<void> {
    const userExists = await this.userRepository.existUserByEmail(email);
    if (userExists) {
      throw new UserAlreadyExistsError();
    }
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const userExists = await this.userRepository.existUserById(userId);
    if (!userExists) {
      throw new EntityNotFoundException('user');
    }
  }

  private async ensureRoleExists(roleName: string): Promise<void> {
    const roleExists = await this.roleService.existRoleByName(roleName);
    if (!roleExists) {
      throw new EntityNotFoundException('role');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 8);
  }

  private generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }
}
