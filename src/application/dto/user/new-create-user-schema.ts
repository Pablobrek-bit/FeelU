/* eslint-disable @typescript-eslint/no-explicit-any */
// {
//     "email": "familiasilva2020202116@gmail.com",
//     "password": "123456",
//     "profile": {
//         "name": "Familia",
//         "age": 18,
//         "bio": "teste",
//         "emoji": "🔥",
//         "gender": "MULHER",
//         "genderIsVisible": true,
//         "sexualOrientation": "HETERO",
//         "sexualOrientationVisible": true,
//         "course": "Engenharia da Computação",
//         "institution": "UFC",
//         "instagramUrl": "https://www.instagram.com/_pabllo_henrique/",
//         "avatarUrl": "https://imgv3.fotor.com/images/homepage-feature-card/Random-image-generator_5.jpg"
//     },
//     "filters": [
//         {
//             "gender": "HOMEM",
//             "sexualOrientations": ["HETERO", "BI"]
//         },
//         {
//             "gender": "MULHER",
//             "sexualOrientations": ["HETERO", "BI", "HOMOSSEXUAL"]
//         }
//     ]

import { Gender, SexualOrientation } from '@prisma/client';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateFilterSchema } from '../filter/create-filter-schema';
import { Type } from 'class-transformer';

// }
export class NewCreateUserSchema {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;

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

  @IsDefined({ message: 'Filters are required' })
  @ValidateNested({ each: true })
  @Type(() => CreateFilterSchema)
  filters: CreateFilterSchema[];

  static fromRaw(raw: any): NewCreateUserSchema {
    raw.age = parseInt(raw.age, 10);
    raw.genderIsVisible = raw.genderIsVisible === 'true';
    raw.sexualOrientationVisible = raw.sexualOrientationVisible === 'true';
    raw.filters = JSON.parse(raw.filters).map((filter: any) => ({
      ...filter,
      sexualOrientations: Array.isArray(filter.sexualOrientations)
        ? filter.sexualOrientations
        : [filter.sexualOrientations],
    }));

    return Object.assign(new NewCreateUserSchema(), raw);
  }
}

// no estilo form data vai ficar assim:
