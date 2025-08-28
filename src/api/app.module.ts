import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnergyModule } from './energy/energy.module';
import configuration from 'src/common/config/configuration';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [configuration],
    }),
    EnergyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
