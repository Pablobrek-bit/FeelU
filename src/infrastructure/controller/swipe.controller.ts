import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SwipeService } from '../../application/service/swipe.service';
import { SwipeProfileDto } from '../../application/dto/swipe/swipe-profile.dto';
import type { Request } from 'express';
import type { UserModel } from '../../domain/model/user-model';
import { RoleGuard } from '../../middleware/role-guard';

@Controller('swipe')
export class SwipeController {
  constructor(private readonly swipeService: SwipeService) {}

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

  @Get('matches')
  @HttpCode(200)
  @UseGuards(new RoleGuard(['VIP']))
  async getMatches(@Req() req: Request): Promise<UserModel[]> {
    const userId = req.user.sub;
    const matches = this.swipeService.getMatches(userId);

    return matches;
  }
}
