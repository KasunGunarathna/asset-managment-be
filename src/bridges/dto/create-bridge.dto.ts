import { IsEnum, IsNumber, IsString } from 'class-validator';

enum Condition {
  Excellent = 'Excellent',
  Good = 'Good',
  Average = 'Average',
  Poor = 'Poor',
  VeryPoor = 'Very poor',
}

export class CreateBridgeDto {
  @IsString()
  bridge_name: string;

  @IsString()
  road_name: string;

  @IsString()
  location: string;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

  @IsEnum(Condition)
  structure_condition: string;

  @IsEnum(Condition)
  road_surface_condition: string;

  @IsString()
  remarks: string;
}
