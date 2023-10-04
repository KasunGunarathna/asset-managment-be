import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesEntity } from './entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehiclesEntity])],
  controllers: [VehiclesController],
  providers: [JwtService, VehiclesService],
})
export class VehiclesModule {}
