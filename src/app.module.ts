import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BridgesModule } from './bridges/bridges.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BridgesEntity } from './bridges/entities/bridge.entity';

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
      entities: [BridgesEntity],
    }),
    BridgesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
