import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { DrainagesService } from './drainages.service';
import { DrainagesController } from './drainages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrainageEntity } from './entities/drainages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DrainageEntity])],
  controllers: [DrainagesController],
  providers: [JwtService, DrainagesService],
})
export class DrainagesModule {}
