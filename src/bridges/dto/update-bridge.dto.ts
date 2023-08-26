import { PartialType } from '@nestjs/mapped-types';
import { CreateBridgeDto } from './create-bridge.dto';

export class UpdateBridgeDto extends PartialType(CreateBridgeDto) {}
