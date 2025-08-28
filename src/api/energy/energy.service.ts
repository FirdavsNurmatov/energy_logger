import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateEnergyDto } from './dto/create-energy.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Cron, Interval } from '@nestjs/schedule';
import TuyAPI from 'tuyapi';

@Injectable()
export class EnergyService {
  private readonly logger = new Logger(EnergyService.name);
  private device: any;

  constructor(
    private readonly prisma: PrismaService,
  ) {
    this.device = new TuyAPI({
      id: 'your_device_id',
      ip: '172.25.24.231',
      key: "rdgkG#Ax4*'6z~NC",
      version: '3.4',
    });
  }

  @Interval(10000) // har 10 soniyada ishlaydi
  async readDevice() {
    try {
      await this.device.find();
      await this.device.connect();

      const status = await this.device.get({ schema: true });
      const dps = status.dps || {};

      const power_w = (dps['19'] ?? 0) / 10;
      const current_a = (dps['18'] ?? 0) / 1000;
      const voltage_v = (dps['20'] ?? 0) / 10;

      const payload: CreateEnergyDto = {
        device_id: 1,
        power_w,
        current_a,
        voltage_v,
      };

      // endi API ga yuborish o‘rniga create() ni chaqiramiz
      console.log(payload)
      await this.create(payload);

      this.logger.log(
        `Device data saved → power=${power_w}W, current=${current_a}A, voltage=${voltage_v}V`,
      );

      this.device.disconnect();
    } catch (err) {
      this.logger.error(`Xatolik: ${err.message}`);
    }
  }

  async create(createEnergyDto: CreateEnergyDto) {
    try {
      const res = await this.prisma.energy_logs.create({
        data: createEnergyDto,
      });

      return {
        status_code: 201,
        message: 'Energy log created',
        data: res,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getStatistics(deviceId: number, period: 'day' | 'hour') {
    try {
      if (period === 'hour') {
        const res = await this.prisma.energy_logs_by_hour.findMany({
          where: { device_id: deviceId },
          orderBy: { hour: 'asc' },
        });

        return {
          status_code: 200,
          message: `Energy logs fetched (hourly)`,
          length: res.length,
          data: res,
        };
      }

      if (period === 'day') {
        const res = await this.prisma.energy_logs_by_day.findMany({
          where: { device_id: deviceId },
          orderBy: { day: 'asc' },
        });

        return {
          status_code: 200,
          message: `Energy logs fetched (daily)`,
          length: res.length,
          data: res,
        };
      }

      throw new BadRequestException('Invalid period');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Cron('0 * * * * *')
  async aggregateLogs() {
    try {
      this.logger.log('Aggregating energy logs...');

      // Soatlik hisoblash
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO energy_logs_by_hour (hour, device_id, energy_kwh)
        WITH s AS (
          SELECT
            device_id,
            power_w,
            CAST(DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') AS DATETIME) AS hour,
            created_at,
            LAG(created_at) OVER (PARTITION BY device_id ORDER BY created_at) AS prev_created_at
          FROM energy_logs
          WHERE created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 HOUR) -- faqat oxirgi tugagan soat
            AND created_at < UTC_TIMESTAMP()
        )
        SELECT
          hour,
          device_id,
          SUM(power_w * IFNULL(TIMESTAMPDIFF(SECOND, prev_created_at, created_at), 10)) / 3600000 AS energy_kwh
        FROM s
        GROUP BY hour, device_id
        ON DUPLICATE KEY UPDATE
          energy_kwh = VALUES(energy_kwh);
    `);

      // Kunlik hisoblash
      await this.prisma.$executeRawUnsafe(`
      INSERT INTO energy_logs_by_day (day, device_id, energy_kwh)
      WITH s AS (
        SELECT
          device_id,
          power_w,
          DATE(created_at) AS day,
          TIMESTAMPDIFF(
            SECOND,
            LAG(created_at) OVER (PARTITION BY device_id ORDER BY created_at),
            created_at
          ) AS sec
        FROM energy_logs
        WHERE created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY)
      )
      SELECT
        day,
        device_id,
        SUM(power_w * IFNULL(sec, 10)) / 3600000 AS energy_kwh
      FROM s
      GROUP BY day, device_id
      ON DUPLICATE KEY UPDATE
        energy_kwh = VALUES(energy_kwh);
    `);

      this.logger.log('Energy logs aggregated successfully ✅');
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
