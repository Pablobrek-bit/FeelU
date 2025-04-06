import { IsOptional, IsString, Length } from 'class-validator';
import { CreateProfileSchema } from '../profile/create-profile-schema';
import type { CreateFilterSchema } from '../filter/create-filter-schema';

// criar um novo schema de validação para o profile usando
type UpdateProfileSchema = Omit<
  Partial<CreateProfileSchema>,
  'name' | 'age' | 'gender' | 'sexualOrientation'
>;

type UpdateFilterSchema = Partial<CreateFilterSchema>;

export class UpdateUserSchema {
  @IsString()
  @Length(6, 20, { message: 'Password must be between 8 and 20 characters' })
  @IsOptional()
  password?: string;

  @IsOptional()
  profile?: UpdateProfileSchema;

  @IsOptional()
  filters?: UpdateFilterSchema[];
}
