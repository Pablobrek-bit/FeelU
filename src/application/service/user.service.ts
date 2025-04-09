import { Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import { CreateUserSchema } from '../dto/user/create-user-schema';
import { UserAlreadyExistsError } from '../../shared/exception/UserAlreadyExistsError';
import { FilterService } from './filter.service';
import { ProfileService } from './profile.service';
import { hash } from 'bcryptjs';
import { UpdateUserSchema } from '../dto/user/update-user-schema';
import { EntityNotFoundException } from '../../shared/exception/EntityNotFoundException';
import type { UserModel } from '../../domain/model/user-model';
import { RoleService } from './role.service';
import type { Gender, SexualOrientation } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly filterService: FilterService,
    private readonly profileService: ProfileService,
    private readonly roleService: RoleService,
  ) {}

  async createUserWithProfileAndFilter(
    userCreateData: CreateUserSchema,
  ): Promise<void> {
    const userExists = await this.userRepository.existUserByEmail(
      userCreateData.email,
    );

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    const { filters, email, password, profile } = userCreateData;

    const passwordHash = await hash(password, 8);

    const userId = await this.userRepository.createUser({
      email,
      password: passwordHash,
      roleName: 'USER',
    });

    await this.profileService.createProfile(profile, userId);

    await this.filterService.createFilter(filters, userId);
  }

  async updateUser(
    userUpdateData: UpdateUserSchema,
    userId: string,
  ): Promise<void> {
    const userExists = await this.userRepository.existUserById(userId);

    if (!userExists) {
      throw new EntityNotFoundException('user');
    }

    const { filters, profile, password } = userUpdateData;

    if (password) {
      const passwordHash = await hash(password, 8);
      await this.userRepository.updateUserPassword(userId, passwordHash);
    }

    await this.profileService.updateProfile(profile, userId);

    await this.filterService.updateFilter(filters, userId);
  }

  async getUser(userId: string): Promise<UserModel> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new EntityNotFoundException('user');
    }

    return user;
  }

  async updateUserRole(userId: string, roleName: string): Promise<void> {
    const userExists = await this.userRepository.existUserById(userId);

    if (!userExists) {
      throw new EntityNotFoundException('user');
    }

    const roleExists = await this.roleService.existRoleByName(roleName);

    if (!roleExists) {
      throw new EntityNotFoundException('role');
    }

    await this.userRepository.updateUserRole(userId, roleName);
  }

  async findUsersByIds(userIds: string[]): Promise<UserModel[]> {
    const users = await this.userRepository.findUserByIds(userIds);

    return users;
  }

  async findPotentialMatchesUsers(
    userId: string,
    viewedUserIds: string[],
    genders: Gender[],
    sexualOrientations: SexualOrientation[],
    limit: number,
  ): Promise<UserModel[]> {
    const users = await this.userRepository.findPotentialMatches(
      userId,
      viewedUserIds,
      genders,
      sexualOrientations,
      limit,
    );
    return users;
  }
}
