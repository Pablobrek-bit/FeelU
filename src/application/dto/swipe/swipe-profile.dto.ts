import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class SwipeProfileDto {
  @IsNotEmpty()
  @IsUUID()
  profileId: string;

  @IsBoolean()
  liked: boolean;
}
