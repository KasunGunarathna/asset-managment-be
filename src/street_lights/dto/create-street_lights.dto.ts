import { IsString, IsEnum } from 'class-validator';

enum PoleType {
  Concrete = 'Concrete',
  Steel = 'Steel',
}

enum LampType {
  LED = 'LED',
  CFL = 'CFL',
  Pillement = 'Pillement',
  Halogen = 'Halogen',
}

export class CreateStreetLightDto {
  @IsString()
  pole_number: string;

  @IsString()
  road_name: string;

  @IsString()
  wire_condition: string;

  @IsString()
  switch_condition: string;

  @IsEnum(PoleType)
  pole_type: PoleType;

  @IsEnum(LampType)
  lamp_type: LampType;

  @IsString()
  photo: string;
}
