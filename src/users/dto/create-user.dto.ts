import { IsString, IsEnum } from 'class-validator';

enum UserType {
  Admin = 'Admin',
  Collector = 'Collector',
  Viewer = 'Viewer',
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEnum(UserType)
  user_type: UserType;

  @IsString()
  nic: string;

  @IsString()
  password: string;
}
