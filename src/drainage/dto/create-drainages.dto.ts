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

export class CreateDrainageDto {
  @IsString()
  road_name: string;

  @IsEnum(DrainageType)
  drainage_type: DrainageType;

  @IsEnum(DrainageSide)
  side_of_drain: DrainageSide;

  @IsNumber()
  starting_point_latitude: number;

  @IsNumber()
  starting_point_longitude: number;

  @IsNumber()
  end_point_latitude: number;

  @IsNumber()
  end_point_longitude: number;

  @IsString()
  condition: string;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;
}
