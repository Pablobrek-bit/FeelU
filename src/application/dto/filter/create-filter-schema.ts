import { SexualOrientation, Gender } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateFilterSchema {
  @IsEnum(Gender, {
    message: 'Invalid gender',
  })
  gender: Gender;

  @IsEnum(SexualOrientation, {
    each: true,
    message: 'Invalid sexual orientation',
  })
  sexualOrientations: SexualOrientation[];
}
