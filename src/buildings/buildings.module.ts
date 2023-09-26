import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service'; // Import your BuildingsService
import { BuildingsController } from './buildings.controller'; // Import your BuildingsController
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsEntity } from './entities/buildings.entity'; // Import your BuildingsEntity
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([BuildingsEntity])],
  controllers: [BuildingsController], // Use your BuildingsController here
  providers: [JwtService, BuildingsService], // Use your BuildingsService here
})
export class BuildingsModule {}
