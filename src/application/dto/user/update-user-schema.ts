import { IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { UpdateProfileSchema } from '../profile/update-profile-schema';
import { Type } from 'class-transformer';
import { CreateFilterSchema } from '../filter/create-filter-schema';

export class UpdateUserSchema {
  @IsString()
  @IsOptional()
  @Length(6, 20, { message: 'Password must be between 8 and 20 characters' })
  password?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProfileSchema)
  profile: UpdateProfileSchema;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateFilterSchema)
  filters: CreateFilterSchema[];
}
