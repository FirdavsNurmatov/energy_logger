import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnergyModule } from './energy/energy.module';
import configuration from 'src/common/config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [configuration],
    }),
    // ThrottlerModule.forRoot({
    //   throttlers: [
    //     {
    //       ttl: 10 * 1000,
    //       limit: 10,
    //     },
    //   ],
    // }),
    EnergyModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
