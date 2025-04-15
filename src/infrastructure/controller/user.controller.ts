/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiUnsupportedMediaTypeResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UserService } from '../../application/service/user.service';
import { LoginUserSchema } from '../../application/dto/user/login-user-schema';
import { AuthService } from '../../application/service/auth.service';
import { UpdateUserSchema } from '../../application/dto/user/update-user-schema';
import type { Request } from 'express';
import type { UserModel } from '../../domain/model/user-model';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../shared/utils/multer.utils';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TestSchema } from '../../application/dto/user/test-schema';
import { CreateUserSchema } from '../../application/dto/user/create-user-schema';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user with profile and filters' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'example@gmail.com',
        },
        password: { type: 'string', example: 'password123' },
        profile: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer', minimum: 18 },
            bio: { type: 'string' },
            emoji: { type: 'string', maxLength: 1 },
            gender: {
              type: 'string',
              enum: ['MAN', 'WOMAN', 'NON_BINARY'],
            },
            genderIsVisible: { type: 'string' },
            sexualOrientation: {
              type: 'string',
              enum: ['HETEROSEXUAL', 'HOMOSEXUAL', 'BISEXUAL', 'PANSEXUAL'],
            },
            sexualOrientationVisible: { type: 'string' },
            course: { type: 'string' },
            institution: { type: 'string' },
            instagramUrl: { type: 'string', format: 'url' },
          },
        },
        filters: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              gender: {
                type: 'string',
                enum: ['MAN', 'WOMAN', 'NON_BINARY'],
              },
              sexualOrientations: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['HETEROSEXUAL', 'HOMOSEXUAL', 'BISEXUAL', 'PANSEXUAL'],
                },
              },
            },
          },
        },
        avatar: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: { example: { message: 'User created successfully' } },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed for the input data',
    schema: {
      example: {
        ApiBadRequestResponse: [
          {
            property: 'email',
            constraints: {
              isEmail: 'Invalid email format',
            },
          },
          {
            property: 'profile',
            children: [
              {
                property: 'age',
                constraints: {
                  isInt: 'Age must be an integer number',
                  min: 'Age must be at least 18',
                },
              },
              {
                property: 'name',
                constraints: {
                  isString: 'Name must be a string',
                  isNotEmpty: 'Name should not be empty',
                },
              },
            ],
          },
        ],
      },
    },
  })
  @ApiUnsupportedMediaTypeResponse({
    description: 'Invalid file format',
    schema: {
      example: {
        statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        message: 'Invalid file format',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/create',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Avatar file is required',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Avatar file is required',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/create',
      },
    },
  })
  @ApiConflictResponse({
    description: 'User already exists',
    schema: {
      example: {
        statusCode: HttpStatus.CONFLICT,
        message: 'User already exists',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/create',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/create',
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async createUserWithProfileAndFilter(
    @Body() body: any,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    const userCreateData = CreateUserSchema.fromRaw(body);

    const errors = await validate(userCreateData);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    await this.userService.createUser(userCreateData, avatar);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', minLength: 6, maxLength: 20 },
        profile: {
          type: 'object',
          properties: {
            bio: { type: 'string', minLength: 3 },
            emoji: { type: 'string', maxLength: 1 },
            genderIsVisible: { type: 'boolean' },
            sexualOrientationVisible: { type: 'boolean' },
            course: { type: 'string' },
            institution: { type: 'string' },
            instagramUrl: { type: 'string', format: 'url' },
            avatar: { type: 'string', format: 'binary' },
          },
        },
        filters: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              gender: {
                type: 'string',
                format: 'string',
                enum: ['MAN', 'WOMAN', 'NON_BINARY'],
              },
              sexualOrientations: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['HETEROSEXUAL', 'HOMOSEXUAL', 'BISEXUAL', 'PANSEXUAL'],
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    schema: {
      example: {
        message: 'User updated successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid Update credentials',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Invalid email format'],
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/update',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    schema: {
      example: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authorization token is missing or invalid',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/update',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/update',
      },
    },
  })
  async updateUser(
    @Req() req: Request,
    @Body()
    body: any,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    const userUpdateData = UpdateUserSchema.fromRaw(body);

    const errors = await validate(userUpdateData);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const userId = req.user.sub;
    await this.userService.updateUserDetails(userUpdateData, userId, avatar);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
    },
  })
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    schema: { example: { token: 'jwt-token' } },
  })
  @ApiBadRequestResponse({
    description: 'Invalid login credentials',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Invalid email format'],
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/login',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
    schema: {
      example: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid email or password',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/login',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/login',
      },
    },
  })
  async login(@Body() loginData: LoginUserSchema): Promise<{ token: string }> {
    return this.authService.login(loginData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User details retrieved successfully',
    schema: {
      example: {
        id: '52be64a6-7c2a-4745-8def-c7b2a880d9c0',
        email: 'user@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        age: 25,
        gender: 'MAN',
        sexualOrientation: 'HETEROSEXUAL',
        bio: 'Hello, I am a user!',
        emoji: '😊',
        course: 'Computer Science',
        institution: 'XYZ University',
        instagramUrl: 'https://instagram.com/user',
        filters: [
          {
            gender: 'MAN',
            sexualOrientations: ['HETEROSEXUAL', 'BISEXUAL'],
          },
          {
            gender: 'WOMAN',
            sexualOrientations: ['HETEROSEXUAL', 'PANSEXUAL'],
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    schema: {
      example: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authorization token is missing or invalid',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/get',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/get',
      },
    },
  })
  async getUser(@Req() req: Request): Promise<UserModel> {
    const userId = req.user.sub;
    return await this.userService.getUserById(userId);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
    schema: { example: { message: 'Email verified successfully' } },
  })
  @ApiBadRequestResponse({
    description: 'Token is required',
    schema: {
      example: {
        statusCode: 404,
        message: 'Token is required',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/verify-email',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/verify-email',
      },
    },
  })
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.userService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }

  @Delete('delete')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    example: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Authorization token is missing or invalid',
      timestamp: '2023-10-01T00:00:00.000Z',
      path: '/user/delete',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: '2023-10-01T00:00:00.000Z',
        path: '/user/delete',
      },
    },
  })
  async deleteUser(@Req() req: Request): Promise<void> {
    const userId = req.user.sub;
    await this.userService.softDelete(userId);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    console.log('File received:', file);
    console.log('Avatar uploaded for user:', req.user.sub);
    return { message: 'Avatar uploaded successfully' };
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async test(
    @Req() req: Request,
    @Body() test: any,
  ): Promise<{ message: string }> {
    console.log('test', test);
    console.log('file', req.file);
    const dto = plainToInstance(TestSchema, test);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    console.log('User ID (do token):', req.user.sub);
    console.log('Test data:', dto);
    return { message: 'ok' };
  }
}
