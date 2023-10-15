import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsEntity } from './entities/buildings.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([BuildingsEntity])],
  controllers: [BuildingsController],
  providers: [JwtService, BuildingsService],
})
export class BuildingsModule {}
