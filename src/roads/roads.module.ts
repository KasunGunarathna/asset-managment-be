import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { RoadsService } from './roads.service';
import { RoadsController } from './roads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadEntity } from './entities/roads.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoadEntity])],
  controllers: [RoadsController],
  providers: [JwtService, RoadsService],
})
export class RoadsModule {}
