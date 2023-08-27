import { PartialType } from '@nestjs/mapped-types';
import { CreateDrainageDto } from './create-drainages.dto';

export class UpdateDrainageDto extends PartialType(CreateDrainageDto) {}
