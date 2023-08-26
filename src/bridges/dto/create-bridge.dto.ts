import { IsNumber, IsString } from 'class-validator';

export class CreateBridgeDto {
  @IsString()
  bridge_name: string;

  @IsString()
  road_name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

  @IsString()
  structure_condition: string;

  @IsString()
  road_surface_condition: string;

  @IsString()
  remarks: string;
}
