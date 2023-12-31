import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BridgesModule } from './bridges/bridges.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadsModule } from './roads/roads.module';
import { StreetLightsModule } from './street_lights/street_lights.module';
import { DrainagesModule } from './drainage/drainages.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authentication/auth.module';
import { BuildingsModule } from './buildings/buildings.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'asset_mng',
      synchronize: true,
      logging: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    BuildingsModule,
    BridgesModule,
    RoadsModule,
    StreetLightsModule,
    DrainagesModule,
    UsersModule,
    AuthModule,
    VehiclesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
