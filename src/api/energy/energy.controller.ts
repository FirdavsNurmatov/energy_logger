import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EnergyService } from './energy.service';
import { CreateEnergyDto } from './dto/create-energy.dto';
import { UpdateEnergyDto } from './dto/update-energy.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums';

@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.ADMIN)
@Controller('energy')
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Post()
  create(@Body() createEnergyDto: CreateEnergyDto) {
    return this.energyService.create(createEnergyDto);
  }

  @Get()
  findAll() {
    return this.energyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.energyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnergyDto: UpdateEnergyDto) {
    return this.energyService.update(+id, updateEnergyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.energyService.remove(+id);
  }
}
