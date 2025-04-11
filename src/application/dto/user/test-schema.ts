import { IsNotEmpty } from 'class-validator';

export class TestSchema {
  @IsNotEmpty()
  name: string;
}
