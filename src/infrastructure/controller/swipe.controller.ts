import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwipeService } from '../../application/service/swipe.service';
import { SwipeProfileDto } from '../../application/dto/swipe/swipe-profile.dto';
import type { Request } from 'express';
import type { UserModel } from '../../domain/model/user-model';
import { RoleGuard } from '../../middleware/role-guard';

@ApiTags('Swipe')
@Controller('swipe')
export class SwipeController {
  constructor(private readonly swipeService: SwipeService) {}

  @Get('profiles')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get potential matches for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of potential matches',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          avatarUrl: { type: 'string', format: 'uri' },
          age: { type: 'number' },
          gender: { type: 'string' },
          sexualOrientation: { type: 'string' },
          bio: { type: 'string' },
          emoji: { type: 'string' },
          course: { type: 'string' },
          institution: { type: 'string' },
          instagramUrl: { type: 'string', format: 'uri' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Authorization token is missing or invalid',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/swipe/profiles',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/swipe/profiles',
      },
    },
  })
  async getPotentialMatches(@Req() req: Request): Promise<UserModel[]> {
    const userId = req.user.sub;
    return this.swipeService.findPotentialMatches(userId);
  }

  @Post('profile')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Swipe a profile' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileId: { type: 'string' },
        liked: { type: 'boolean' },
      },
      required: ['profileId', 'liked'],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Authorization token is missing or invalid',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/swipe/profile',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/swipe/profile',
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of matches',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          avatarUrl: { type: 'string', format: 'uri' },
          age: { type: 'number' },
          gender: { type: 'string' },
          sexualOrientation: { type: 'string' },
          bio: { type: 'string' },
          emoji: { type: 'string' },
          course: { type: 'string' },
          institution: { type: 'string' },
          instagramUrl: { type: 'string', format: 'uri' },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get matches for a user' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Authorization token is missing or invalid',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/swipe/matches',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/swipe/matches',
      },
    },
  })
  async getMatches(@Req() req: Request): Promise<UserModel[]> {
    const userId = req.user.sub;
    const matches = this.swipeService.getMatches(userId);

    return matches;
  }

  @Get('liked-profiles')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get liked profiles for a user' })
  @UseGuards(new RoleGuard(['VIP', 'ADMIN']))
  @ApiResponse({
    status: 200,
    description: 'List of matches',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          avatarUrl: { type: 'string', format: 'uri' },
          age: { type: 'number' },
          gender: { type: 'string' },
          sexualOrientation: { type: 'string' },
          bio: { type: 'string' },
          emoji: { type: 'string' },
          course: { type: 'string' },
          institution: { type: 'string' },
          instagramUrl: { type: 'string', format: 'uri' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Authorization token is missing or invalid',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/swipe/liked-profiles',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/swipe/liked-profiles',
      },
    },
  })
  async getLikedProfiles(@Req() req: Request): Promise<UserModel[]> {
    const userId = req.user.sub;
    return this.swipeService.getLikedProfiles(userId);
  }
}
