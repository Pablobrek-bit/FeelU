import type { Gender, SexualOrientation } from '@prisma/client';
import type { FilterModel } from './filters-model';

export class UserModel {
  constructor(
    public id: string,
    public name: string,
    public avatarUrl: string,
    public age: number,
    public gender: Gender,
    public sexualOrientation: SexualOrientation,
    public showGender: boolean,
    public showSexualOrientation: boolean,
    public bio: string,
    public emoji?: string,
    public course?: string,
    public institution?: string,
    public instagramUrl?: string,
    public filters?: FilterModel[],
    public likes?: number,
  ) {}
}
