import { PartialType } from '@nestjs/mapped-types';
import { CreateRoadDto } from './create-roads.dto';

export class UpdateRoadDto extends PartialType(CreateRoadDto) {}
