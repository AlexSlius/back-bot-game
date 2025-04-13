import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { RoleModeratorGuard } from 'src/common/guards/role-moderator';

import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller()
export class CityController {
  constructor(private readonly cityService: CityService) { }

  @UseGuards(RoleModeratorGuard)
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.cityService.findAll({ page: +page, limit: +limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(+id);
  }

  @UseGuards(RoleModeratorGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }
}
