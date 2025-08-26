import { Module } from '@nestjs/common';
import { EnergyService } from './energy.service';
import { EnergyController } from './energy.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('accessToken.accessTokenKey'),
        signOptions: {
          expiresIn: configService.get<string>(
            'accessToken.accessTokenExpireTime',
          ),
        },
      }),
    }),
  ],
  controllers: [EnergyController],
  providers: [EnergyService, PrismaService],
})
export class EnergyModule {}
