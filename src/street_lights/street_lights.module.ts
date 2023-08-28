import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { StreetLightsService } from './street_lights.service';
import { StreetLightsController } from './street_lights.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreetLightEntity } from './entities/street_lights.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StreetLightEntity])],
  controllers: [StreetLightsController],
  providers: [JwtService, StreetLightsService],
})
export class StreetLightsModule {}
