import { Injectable } from '@nestjs/common';
import { SwipeRepository } from '../ports/swipe.repository';
import { UserRepository } from '../ports/user.repository';
import { EntityNotFoundException } from '../../shared/exception/EntityNotFoundException';
import type { UserModel } from '../../domain/model/user-model';
import type { Gender, SexualOrientation } from '@prisma/client';

@Injectable()
export class SwipeService {
  constructor(
    private readonly swipeRepository: SwipeRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getPotentialMatches(userId: string): Promise<UserModel[]> {
    const user = await this.userRepository.getById(userId);
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

    // Buscar potenciais matches com base nos filtros
    const userFind = await this.swipeRepository.findPotentialMatches(
      userId,
      { genders, sexualOrientations },
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
}
