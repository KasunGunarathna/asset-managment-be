import { PartialType } from '@nestjs/mapped-types';
import { CreateStreetLightDto } from './create-street_lights.dto';

export class UpdateStreetLightDto extends PartialType(CreateStreetLightDto) {}
