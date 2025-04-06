import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

// export type UpdateProfileSchema = Omit<
//   Partial<CreateProfileSchema>,
//   'name' | 'age' | 'gender' | 'sexualOrientation'
// >;

export class UpdateProfileSchema {
  @MinLength(3, { message: 'Bio must be at least 3 characters long' })
  @IsString()
  @IsOptional()
  bio: string;

  @Length(1, 1, { message: 'Emoji must be a single character' })
  @IsString()
  @IsOptional()
  emoji: string;

  @IsBoolean()
  @IsOptional()
  genderIsVisible: boolean;

  @IsBoolean()
  @IsOptional()
  sexualOrientationVisible: boolean;

  @IsString()
  @IsOptional()
  course: string;

  @IsString()
  @IsOptional()
  institution: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format' })
  instagramUrl: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format' })
  avatarUrl: string;
}
