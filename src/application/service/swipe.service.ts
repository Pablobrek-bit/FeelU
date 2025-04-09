import { Injectable } from '@nestjs/common';
import { SwipeRepository } from '../ports/swipe.repository';
import { EntityNotFoundException } from '../../shared/exception/EntityNotFoundException';
import type { UserModel } from '../../domain/model/user-model';
import type { Gender, SexualOrientation } from '@prisma/client';
import { UserService } from './user.service';

@Injectable()
export class SwipeService {
  constructor(
    private readonly swipeRepository: SwipeRepository,
    private readonly userService: UserService,
  ) {}

  async findPotentialMatches(userId: string): Promise<UserModel[]> {
    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new EntityNotFoundException('User');
    }

    const filterPreferences = user.filters || [];

    const genders: Gender[] = [
      ...new Set(filterPreferences.map((fp) => fp.gender)),
    ];
    const sexualOrientations: SexualOrientation[] = [
      ...new Set(filterPreferences.map((fp) => fp.sexualOrientation)),
    ];

    const usersIdFind = await this.swipeRepository.findPotentialMatchesIds(
      userId,
      10,
    );

    const userFind = await this.userService.findPotentialMatchesUsers(
      userId,
      usersIdFind,
      genders,
      sexualOrientations,
      10,
    );

    return userFind;
  }

  async swipeProfile(
    userId: string,
    swipedUserId: string,
    liked: boolean,
  ): Promise<void> {
    // Registrar visualização
    await this.swipeRepository.registerView(userId, swipedUserId);

    // Se o usuário curtiu o perfil
    if (liked) {
      // Registrar like e verificar se é um match
      const isMatch = await this.swipeRepository.registerLike(
        userId,
        swipedUserId,
      );

      // Se for um match, registrar o match
      if (isMatch) {
        await this.swipeRepository.registerMatch(userId, swipedUserId);
      }
    }
  }

  async getMatches(userId: string): Promise<UserModel[]> {
    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new EntityNotFoundException('User');
    }

    const matchesIds = await this.swipeRepository.getMatches(userId);

    return await this.userService.findUsersByIds(matchesIds);
  }

  async getLikedProfiles(userId: string): Promise<UserModel[]> {
    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new EntityNotFoundException('User');
    }

    const likedProfilesIds =
      await this.swipeRepository.getLikedProfiles(userId);

    return await this.userService.findUsersByIds(likedProfilesIds);
  }
}
