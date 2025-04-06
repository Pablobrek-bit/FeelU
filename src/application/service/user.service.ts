import { Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import { CreateUserSchema } from '../dto/user/create-user-schema';
import { UserAlreadyExistsError } from '../../shared/exception/UserAlreadyExistsError';
import { FilterService } from './filter.service';
import { ProfileService } from './profile.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly filterService: FilterService,
    private readonly profileService: ProfileService,
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
    });

    await this.profileService.createProfile(profile, userId);

    await this.filterService.createFilter(filters, userId);
  }
}
