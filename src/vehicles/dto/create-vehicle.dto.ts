import { IsEnum, IsNumber, IsString } from 'class-validator';

enum FuelType {
  Petrol = 'Petrol',
  Diesel = 'Diesel',
  Electric = 'Electric',
  Hybrid = 'Hybrid',
  Other = 'Other',
}

enum TaxationClass {
  Personal = 'Personal',
  Corporate = 'Corporate',
}

export class CreateVehicleDto {
  @IsString()
  vehicle_number: string;

  @IsString()
  vehicle_make: string;

  @IsString()
  model: string;

  @IsEnum(FuelType)
  fuel_type: string;

  @IsString()
  license_from: string;

  @IsString()
  license_to: string;

  @IsString()
  engine_number: string;

  @IsString()
  allocated_location: string;

  @IsNumber()
  yom: number;

  @IsNumber()
  yor: number;

  @IsString()
  chassi_number: string;

  @IsEnum(TaxationClass)
  taxation_class: string;

  @IsString()
  wheel_size: string;

  @IsString()
  battery_required: string;

  @IsNumber()
  fuel_consume: number;

  @IsString()
  date_of_tested: string;

  // You can add more validation rules for other fields as needed
}
