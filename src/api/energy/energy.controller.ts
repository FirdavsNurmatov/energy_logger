import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EnergyService } from './energy.service';
import { CreateEnergyDto } from './dto/create-energy.dto';

@Controller('energy')
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Get('stats/:deviceId/:period')
  async getStats(
    @Param('deviceId') deviceId: string,
    @Param('period') period: 'day' | 'hour',
  ) {
    return this.energyService.getStatistics(Number(deviceId), period);
  }
}
