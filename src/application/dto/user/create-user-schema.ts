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
}
