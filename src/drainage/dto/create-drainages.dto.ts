import { IsString, IsEnum, IsNumber } from 'class-validator';

enum DrainageType {
  OpenUDrain = 'Open U drain',
  CloseUDrain = 'Close U drain',
  ShoueDrain = 'Shoue drain',
  EarthDrain = 'Earth Drain',
}

enum DrainageSide {
  Left = 'Left',
  Right = 'Right',
}

enum Condition {
  Excellent = 'Excellent',
  Good = 'Good',
  Average = 'Average',
  Poor = 'Poor',
  VeryPoor = 'Very poor',
}

export class CreateDrainageDto {
  @IsString()
  road_name: string;

  @IsEnum(DrainageType)
  drainage_type: DrainageType;

  @IsEnum(DrainageSide)
  side_of_drain: DrainageSide;

  @IsString()
  starting_point_location: string;

  @IsString()
  end_point_location: string;

  @IsEnum(Condition)
  condition: string;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;
}
