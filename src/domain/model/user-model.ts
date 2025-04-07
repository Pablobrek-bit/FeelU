// retorna: Nome, avatarUrl, idade, emoji, curso, faculdade, genero, orientação sexual, instagram e bio

import type { Gender, SexualOrientation } from '@prisma/client';
import type { FilterModel } from './filters-model';

// genero visivel, orientação sexual visivel, filtro
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
    public couse?: string,
    public institution?: string,
    public instagramUrl?: string,
    public filters?: FilterModel[],
  ) {}
}
