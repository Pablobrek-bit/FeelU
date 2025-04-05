import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsDefined,
} from 'class-validator';
import { CreateProfileSchema } from '../profile/create-profile-schema';
import { CreateFilterSchema } from '../filter/create-filter-schema';

export class CreateUserSchema {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;

  @IsDefined({ message: 'Profile is required' })
  profile: CreateProfileSchema;

  @IsDefined({ message: 'Filters are required' })
  filters: CreateFilterSchema[];

  // @IsString()
  // @IsNotEmpty()
  // name: string;

  // @IsInt()
  // @IsPositive()
  // @Min(18, { message: 'Age must be at least 18' })
  // age: number;

  // @IsString()
  // @MinLength(3, { message: 'Bio must be at least 3 characters long' })
  // bio: string;

  // @IsString()
  // @Length(1, 1, { message: 'Emoji must be a single character' })
  // emoji: string;

  // @IsEnum(Gender)
  // gender: Gender;

  // @IsBoolean()
  // genderIsVisible: boolean;

  // @IsEnum(SexualOrientation)
  // sexualOrientation: SexualOrientation;

  // @IsBoolean()
  // sexualOrientationVisible: boolean;

  // @IsString()
  // course: string;

  // @IsString()
  // @IsString()
  // @IsOptional()
  // institution: string;

  // @IsString()
  // @IsOptional()
  // @IsUrl({}, { message: 'Invalid URL format' })
  // instagramUrl: string;

  // @IsString()
  // @IsOptional()
  // @IsUrl({}, { message: 'Invalid URL format' })
  // avatarUrl: string;
}
