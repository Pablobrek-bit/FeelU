import { Gender, SexualOrientation } from '@prisma/client';
import {
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsString,
  Min,
  MinLength,
  Length,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateProfileSchema {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsPositive()
  @Min(18, { message: 'Age must be at least 18' })
  age: number;

  @IsString()
  @MinLength(3, { message: 'Bio must be at least 3 characters long' })
  bio: string;

  @IsString()
  @Length(1, 1, { message: 'Emoji must be a single character' })
  emoji: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsBoolean()
  genderIsVisible: boolean;

  @IsEnum(SexualOrientation)
  sexualOrientation: SexualOrientation;

  @IsBoolean()
  sexualOrientationVisible: boolean;

  @IsString()
  course: string;

  @IsString()
  @IsString()
  @IsOptional()
  institution: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format' })
  instagramUrl: string;
}
