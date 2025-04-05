import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeZoneService } from './time-zone.service';
import { CreateTimeZoneDto } from './dto/create-time-zone.dto';
import { UpdateTimeZoneDto } from './dto/update-time-zone.dto';

@Controller('time-zone')
export class TimeZoneController {
  constructor(private readonly timeZoneService: TimeZoneService) {}

  @Post()
  create(@Body() createTimeZoneDto: CreateTimeZoneDto) {
    return this.timeZoneService.create(createTimeZoneDto);
  }

  @Get()
  findAll() {
    return this.timeZoneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeZoneService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimeZoneDto: UpdateTimeZoneDto) {
    return this.timeZoneService.update(+id, updateTimeZoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeZoneService.remove(+id);
  }
}
