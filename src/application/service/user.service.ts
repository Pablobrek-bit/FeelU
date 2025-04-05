import { Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import { CreateUserSchema } from '../dto/user/create-user-schema';
import { UserAlreadyExistsError } from '../../shared/exception/UserAlreadyExistsError';
import { FilterService } from './filter.service';
import { ProfileService } from './profile.service';

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

    // const { filters, email, password, profile } = userCreateData;

    // console.log('filters', filters);
    // console.log('email', email);
    // console.log('password', password);
    // console.log('profile', profile);

    // const userId = await this.userRepository.createUser({
    //   email: userCreateData.email,
    //   password: userCreateData.password,
    // });

    await this.filterService.teste();
    await this.profileService.teste();

    // await this.filterService.createFilter(userCreateData.filters, userId);

    // await this.profileService.createProfile(userCreateData.profile, userId);
  }

  async test() {
    await this.filterService.teste();
    await this.profileService.teste();
  }
}
