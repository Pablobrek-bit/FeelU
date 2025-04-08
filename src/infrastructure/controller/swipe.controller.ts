import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { SwipeService } from '../../application/service/swipe.service';
import { SwipeProfileDto } from '../../application/dto/swipe/swipe-profile.dto';
import type { Request } from 'express';
import type { UserModel } from '../../domain/model/user-model';

@Controller('swipe')
export class SwipeController {
  constructor(private readonly swipeService: SwipeService) {}

  // metodo para retornar os perfis que o usuario pode dar swipe
  @Get('profiles')
  @HttpCode(200)
  async getPotentialMatches(@Req() req: Request): Promise<UserModel[]> {
    const userId = req.user.sub;
    return this.swipeService.getPotentialMatches(userId);
  }

  @Post('profile')
  @HttpCode(200)
  async swipeProfile(
    @Req() req: Request,
    @Body() swipeData: SwipeProfileDto,
  ): Promise<void> {
    const userId = req.user.sub;
    return this.swipeService.swipeProfile(
      userId,
      swipeData.profileId,
      swipeData.liked,
    );
  }
}
