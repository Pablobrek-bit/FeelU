import type { Gender, SexualOrientation } from '@prisma/client';

export class FilterModel {
  constructor(
    public gender: Gender,
    public sexualOrientation: SexualOrientation,
  ) {}
}
