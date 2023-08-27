import { IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  nic: string;

  @IsString()
  password: string;
}
