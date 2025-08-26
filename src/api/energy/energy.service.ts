import { Injectable } from '@nestjs/common';
import { CreateEnergyDto } from './dto/create-energy.dto';
import { UpdateEnergyDto } from './dto/update-energy.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class EnergyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEnergyDto: CreateEnergyDto) {
    console.log(createEnergyDto);

    const res = await this.prisma.energy_logs.create({ data: createEnergyDto });

    return {
      status_code: 201,
      message: 'Energy log created',
      data: {
        ...res,
        id: res.id.toString(), // yoki Number(res.id)
      },
    };
  }

  async findAll() {
    const result = await this.prisma.$queryRawUnsafe<
      { device_id: number; day: Date; kwh: number }[]
    >(`
  WITH s AS (
    SELECT
      device_id,
      power_w,
      created_at,
      EXTRACT(EPOCH FROM created_at - LAG(created_at) OVER (
        PARTITION BY device_id ORDER BY created_at
      )) AS sec
    FROM energy_logs
  )
  SELECT
    device_id,
    DATE(created_at) AS day,
    SUM(power_w * COALESCE(sec, 10)) / 3600000 AS kWh
  FROM s
  GROUP BY device_id, day
  ORDER BY device_id, day;
`);

    console.log(result);

    return result;
  }

  async findOne(id: number) {
    return `This action returns a #${id} energy`;
  }

  async update(id: number, updateEnergyDto: UpdateEnergyDto) {
    return `This action updates a #${id} energy`;
  }

  async remove(id: number) {
    return `This action removes a #${id} energy`;
  }
}
