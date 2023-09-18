import { IsNumber, IsString, IsEnum } from 'class-validator';

enum PavementType {
  Asphalt = 'Asphalt',
  Tar = 'Tar',
  Concrete = 'Concrete',
  Interlock = 'Interlock',
  Gravel = 'Gravel',
}

enum SurfaceCondition {
  Excellent = 'Excellent',
  Good = 'Good',
  Average = 'Average',
  Poor = 'Poor',
  VeryPoor = 'Very poor',
}

enum DrainageAvailability {
  BothSide = 'Bothside',
  LeftSide = 'Left Side',
  RightSide = 'Right Side',
  NoDrain = 'No drain',
  DrainageProblems = 'Drainage problems',
}

export class CreateRoadDto {
  @IsString()
  road_name: string;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

  @IsString()
  gazetted_detail: string;

  @IsString()
  survey_plan: string;

  @IsEnum(SurfaceCondition)
  surface_condition: SurfaceCondition;

  @IsEnum(PavementType)
  pavement_type: PavementType;

  @IsNumber()
  starting_point_latitude: number;

  @IsNumber()
  starting_point_longitude: number;

  starting_point_photo: string;

  @IsNumber()
  end_point_latitude: number;

  @IsNumber()
  end_point_longitude: number;

  end_point_photo: string;

  @IsEnum(DrainageAvailability)
  drainage_availability: DrainageAvailability;
}
