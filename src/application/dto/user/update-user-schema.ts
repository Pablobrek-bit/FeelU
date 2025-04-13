/* eslint-disable @typescript-eslint/no-explicit-any */
import { IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { UpdateProfileSchema } from '../profile/update-profile-schema';
import { Type, plainToInstance } from 'class-transformer';
import { CreateFilterSchema } from '../filter/create-filter-schema';
import { BadRequestException } from '@nestjs/common'; // Importar BadRequestException

export class UpdateUserSchema {
  @IsString()
  @IsOptional()
  @Length(6, 20, { message: 'Password must be between 8 and 20 characters' })
  password?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProfileSchema)
  profile?: UpdateProfileSchema;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateFilterSchema)
  filters?: CreateFilterSchema[];

  static fromRaw(raw: any): UpdateUserSchema {
    const instance = new UpdateUserSchema();

    if (!raw) {
      console.warn(
        'UpdateUserSchema.fromRaw received null or undefined input.',
      );
      return instance;
    }

    if (raw.password) {
      instance.password = raw.password;
    }

    if (raw.profile) {
      try {
        raw.profile = JSON.parse(raw.profile);

        if (
          raw.profile.sexualOrientationVisible &&
          (raw.profile.sexualOrientationVisible === 'true' ||
            raw.profile.sexualOrientationVisible === 'false')
        ) {
          raw.profile.sexualOrientationVisible =
            raw.profile.sexualOrientationVisible === 'true';
        }

        if (
          raw.profile.genderIsVisible &&
          (raw.profile.genderIsVisible === 'true' ||
            raw.profile.genderIsVisible === 'false')
        ) {
          raw.profile.genderIsVisible = raw.profile.genderIsVisible === 'true';
        }

        instance.profile = plainToInstance(UpdateProfileSchema, raw.profile);
      } catch (e) {
        console.error('Failed to parse profile JSON:', e);
        throw new BadRequestException('Invalid format for profile data');
      }
    }

    if (raw.filters) {
      try {
        let parsedFilters = JSON.parse(raw.filters);

        if (!Array.isArray(parsedFilters)) {
          parsedFilters = [];
        }

        parsedFilters = parsedFilters.map((filter: any) => ({
          ...filter,
          sexualOrientations: Array.isArray(filter.sexualOrientations)
            ? filter.sexualOrientations
            : [filter.sexualOrientations].filter(
                (so) => so !== null && so !== undefined,
              ),
        }));

        instance.filters = parsedFilters.map((filterObj) =>
          plainToInstance(CreateFilterSchema, filterObj),
        );
      } catch (e) {
        console.error('Failed to parse filters JSON:', e);
        throw new BadRequestException('Invalid format for filters data');
      }
    }

    return instance;
  }
}
