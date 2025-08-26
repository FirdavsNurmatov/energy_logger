import { IsNumber, IsOptional } from 'class-validator';

export class CreateEnergyDto {
  @IsNumber()
  device_id: number;

  @IsOptional()
  @IsNumber()
  current_a: number;

  @IsOptional()
  @IsNumber()
  voltage_v: number;

  @IsNumber()
  power_w: number;
}
