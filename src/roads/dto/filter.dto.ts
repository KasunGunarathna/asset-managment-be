import { IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  f1name?: string;

  @IsOptional()
  @IsString()
  f1value?: string;

  @IsOptional()
  @IsString()
  f2name?: string;

  @IsOptional()
  @IsString()
  f2value?: string;
}
