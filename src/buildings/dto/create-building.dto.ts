import { IsEnum, IsNumber, IsString } from 'class-validator';

enum BuildingCondition {
  Excellent = 'Excellent',
  Good = 'Good',
  Average = 'Average',
  Poor = 'Poor',
  VeryPoor = 'Very poor',
}

export class CreateBuildingDto {
  @IsString()
  name: string;

  @IsString()
  plan: string;

  @IsNumber()
  number_of_stories: number;

  photo: string;

  @IsString()
  location: string;

  @IsNumber()
  built_year: number;

  @IsEnum(BuildingCondition)
  condition: string;

  @IsString()
  remark: string;
}
