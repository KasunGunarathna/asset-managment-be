import { Module } from '@nestjs/common';
import { BridgesService } from './bridges.service';
import { BridgesController } from './bridges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BridgesEntity } from './entities/bridge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BridgesEntity])],
  controllers: [BridgesController],
  providers: [BridgesService],
})
export class BridgesModule {}
