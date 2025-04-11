import { SexualOrientation, Gender } from '@prisma/client';
import { IsArray, IsEnum } from 'class-validator';

export class CreateFilterSchema {
  @IsEnum(Gender, {
    message: 'Invalid gender',
  })
  gender: Gender;

  @IsArray()
  @IsEnum(SexualOrientation, {
    each: true,
    message: 'Invalid sexual orientation',
  })
  sexualOrientations: SexualOrientation[];
}
