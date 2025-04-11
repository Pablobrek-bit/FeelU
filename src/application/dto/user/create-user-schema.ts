/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsDefined,
  ValidateNested,
} from 'class-validator';
import { CreateProfileSchema } from '../profile/create-profile-schema';
import { CreateFilterSchema } from '../filter/create-filter-schema';
import { Type } from 'class-transformer';

export class CreateUserSchema {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;

  @IsDefined({ message: 'Profile is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateProfileSchema)
  profile: CreateProfileSchema;

  @IsDefined({ message: 'Filters are required' })
  @ValidateNested({ each: true })
  @Type(() => CreateFilterSchema)
  filters: CreateFilterSchema[];

  static fromRaw(raw: any): CreateUserSchema {
    const profileJson = JSON.parse(raw.profile);

    const instance = new CreateUserSchema();

    instance.profile = new CreateProfileSchema();

    instance.email = raw.email;
    instance.password = raw.password;

    instance.profile.age = parseInt(profileJson.age, 10);
    instance.profile.name = profileJson.name;
    instance.profile.bio = profileJson.bio;
    instance.profile.emoji = profileJson.emoji || undefined;
    instance.profile.gender = profileJson.gender;
    instance.profile.genderIsVisible = profileJson.genderIsVisible === 'true';
    instance.profile.sexualOrientation = profileJson.sexualOrientation;
    instance.profile.sexualOrientationVisible =
      profileJson.sexualOrientationVisible === 'true';
    instance.profile.course = profileJson.course || undefined;
    instance.profile.institution = profileJson.institution || undefined;
    instance.profile.instagramUrl = profileJson.instagramUrl || undefined;

    instance.filters = JSON.parse(raw.filters).map((filter: any) => ({
      ...filter,
      sexualOrientations: Array.isArray(filter.sexualOrientations)
        ? filter.sexualOrientations
        : [filter.sexualOrientations],
    }));

    return instance;
  }
}
