import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BridgesModule } from './bridges/bridges.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadsModule } from './roads/roads.module';

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
    BridgesModule,
    RoadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
